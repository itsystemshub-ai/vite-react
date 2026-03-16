import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const [salesStats, purchasesStats, lowStock, pendingPayments] = await Promise.all([
      this.prisma.sale.aggregate({ _sum: { total: true }, _count: true, where: { status: 'INVOICED' } }),
      this.prisma.purchase.aggregate({ _sum: { total: true }, _count: true }),
      this.prisma.product.count({ where: { minStock: { gt: 0 } } }),
      this.prisma.paymentOrder.count({ where: { status: 'PENDIENTE' } }),
    ]);
    return {
      totalSales: salesStats._sum.total ?? 0,
      salesCount: salesStats._count,
      totalPurchases: purchasesStats._sum.total ?? 0,
      purchasesCount: purchasesStats._count,
      lowStockProducts: lowStock,
      pendingPayments,
    };
  }

  async getSalesByMonth(year: number) {
    const sales = await this.prisma.sale.findMany({
      where: { status: 'INVOICED', createdAt: { gte: new Date(year, 0, 1), lte: new Date(year, 11, 31) } },
      select: { total: true, createdAt: true },
    });
    const byMonth = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      total: sales.filter(s => new Date(s.createdAt).getMonth() === i).reduce((a, s) => a + s.total, 0),
    }));
    return byMonth;
  }

  async getTopProducts(limit = 10) {
    const items = await this.prisma.saleItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true, subtotal: true },
      orderBy: { _sum: { subtotal: 'desc' } },
      take: limit,
    });
    const products = await this.prisma.product.findMany({ where: { id: { in: items.map(i => i.productId) } } });
    return items.map(i => ({ ...i, product: products.find(p => p.id === i.productId) }));
  }
}
