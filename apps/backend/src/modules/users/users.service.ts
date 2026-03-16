import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      select: { id: true, name: true, email: true, isActive: true, lastLogin: true, role: { select: { name: true } } },
      orderBy: { name: 'asc' },
    });
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, isActive: true, role: { include: { permissions: true } } },
    });
  }

  async create(dto: any) {
    const hash = await bcrypt.hash(dto.password, 12);
    return this.prisma.user.create({
      data: { name: dto.name, email: dto.email, passwordHash: hash, roleId: dto.roleId },
      select: { id: true, name: true, email: true },
    });
  }

  async update(id: string, dto: any) {
    const data: any = { ...dto };
    if (dto.password) { data.passwordHash = await bcrypt.hash(dto.password, 12); delete data.password; }
    return this.prisma.user.update({ where: { id }, data, select: { id: true, name: true, email: true } });
  }

  findAllRoles() {
    return this.prisma.role.findMany({ include: { permissions: true } });
  }
}
