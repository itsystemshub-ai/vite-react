import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async login(email: string, password: string, ip?: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { role: { include: { permissions: true } } },
    });
    if (!user || !user.isActive) throw new UnauthorizedException('Credenciales inválidas');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Credenciales inválidas');

    const permissions = user.role.permissions.map(p => `${p.module}:${p.action}`);
    const payload = { sub: user.id, email: user.email, role: user.role.name, permissions };
    const token = this.jwt.sign(payload);

    await this.prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });
    await this.prisma.session.create({
      data: {
        userId: user.id,
        token,
        ipAddress: ip,
        expiresAt: new Date(Date.now() + 8 * 3600 * 1000),
      },
    });

    return {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role.name, permissions },
    };
  }

  async logout(token: string) {
    await this.prisma.session.deleteMany({ where: { token } });
    return { message: 'Sesión cerrada' };
  }

  async getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, lastLogin: true, role: { select: { name: true, permissions: true } } },
    });
  }
}
