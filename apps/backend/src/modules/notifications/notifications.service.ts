import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  create(data: { userId: string; title: string; message: string; type?: string; module?: string; entityId?: string; actionUrl?: string }) {
    return this.prisma.notification.create({ data: { type: 'INFO', ...data } });
  }

  getUnread(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId, readAt: null },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  getAll(userId: string, page = 1, limit = 20) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  markAsRead(id: string, userId: string) {
    return this.prisma.notification.updateMany({ where: { id, userId }, data: { readAt: new Date() } });
  }

  markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({ where: { userId, readAt: null }, data: { readAt: new Date() } });
  }

  countUnread(userId: string) {
    return this.prisma.notification.count({ where: { userId, readAt: null } });
  }
}
