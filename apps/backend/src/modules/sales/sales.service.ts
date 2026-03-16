import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  findAll(page = 1, limit = 20) {
    return this.prisma.sale.findMany({
      include: { customer: { select: { businessName: true, rif: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  findOne(id: string) {
    return this.prisma.sale.findUnique({
      where: { id },
      include: { customer: true, items: { include: { product: true } } },
    });
  }

  async create(dto: any) {
    const { customerId, items, currency, exchangeRate, notes, dueDate } = dto;
    let subtotal = 0, tax = 0;
    for (const item of items) {
      subtotal += item.quantity * item.price;
      tax += item.quantity * item.price * (item.taxRate ?? 0.16);
    }
    return this.prisma.sale.create({
      data: {
        customerId,
        subtotal,
        tax,
        total: subtotal + tax,
        currency: currency ?? 'VES',
        exchangeRate,
        notes,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        items: { create: items.map((i: any) => ({ ...i, subtotal: i.quantity * i.price })) },
      },
      include: { items: true },
    });
  }

  async invoice(id: string) {
    const sale = await this.prisma.sale.findUnique({ where: { id } });
    if (!sale) throw new NotFoundException('Venta no encontrada');
    if (sale.status !== 'DRAFT') throw new BadRequestException('Solo se puede facturar ventas en borrador');

    const year = new Date().getFullYear();
    const last = await this.prisma.sale.findFirst({
      where: { invoiceNumber: { startsWith: `F${year}-` } },
      orderBy: { invoiceNumber: 'desc' },
    });
    const next = last ? parseInt(last.invoiceNumber!.split('-')[1]) + 1 : 1;
    const invoiceNumber = `F${year}-${next.toString().padStart(6, '0')}`;

    return this.prisma.sale.update({
      where: { id },
      data: { status: 'INVOICED', invoiceNumber },
    });
  }

  async cancel(id: string) {
    return this.prisma.sale.update({ where: { id }, data: { status: 'CANCELLED' } });
  }

  count() {
    return this.prisma.sale.count();
  }

  async stats() {
    const [total, invoiced, draft] = await Promise.all([
      this.prisma.sale.aggregate({ _sum: { total: true } }),
      this.prisma.sale.count({ where: { status: 'INVOICED' } }),
      this.prisma.sale.count({ where: { status: 'DRAFT' } }),
    ]);
    return { totalRevenue: total._sum.total ?? 0, invoiced, draft };
  }
}
