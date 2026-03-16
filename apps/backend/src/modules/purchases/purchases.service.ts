import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PurchasesService {
  constructor(private prisma: PrismaService) {}

  findAll(page = 1, limit = 20) {
    return this.prisma.purchase.findMany({
      include: { supplier: { select: { businessName: true, rif: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  findOne(id: string) {
    return this.prisma.purchase.findUnique({
      where: { id },
      include: { supplier: true, items: { include: { product: true } } },
    });
  }

  async create(dto: any) {
    const { supplierId, items, ...rest } = dto;
    let subtotal = 0, tax = 0;
    for (const item of items) {
      subtotal += item.quantity * item.cost;
      tax += item.quantity * item.cost * (item.taxRate ?? 0.16);
    }
    return this.prisma.purchase.create({
      data: {
        supplierId,
        subtotal,
        tax,
        total: subtotal + tax,
        ...rest,
        items: { create: items.map((i: any) => ({ ...i, subtotal: i.quantity * i.cost })) },
      },
      include: { items: true },
    });
  }

  async receive(id: string) {
    return this.prisma.purchase.update({ where: { id }, data: { status: 'RECEIVED', receivedAt: new Date() } });
  }

  stats() {
    return this.prisma.purchase.aggregate({ _sum: { total: true }, _count: true });
  }
}
