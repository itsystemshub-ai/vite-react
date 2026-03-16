import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  findAllProducts(page = 1, limit = 20, search?: string) {
    return this.prisma.product.findMany({
      where: search ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { code: { contains: search, mode: 'insensitive' } }] } : undefined,
      include: { category: true, stockItems: { include: { warehouse: true } } },
      orderBy: { name: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  findOneProduct(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: { category: true, stockItems: { include: { warehouse: true } } },
    });
  }

  createProduct(dto: any) {
    return this.prisma.product.create({ data: dto });
  }

  updateProduct(id: string, dto: any) {
    return this.prisma.product.update({ where: { id }, data: dto });
  }

  async getStock(productId: string, warehouseId?: string) {
    const items = await this.prisma.stockItem.findMany({
      where: { productId, ...(warehouseId ? { warehouseId } : {}) },
      include: { warehouse: true },
    });
    return items;
  }

  async adjustStock(productId: string, warehouseId: string, quantity: number, type: string, reference?: string) {
    const item = await this.prisma.stockItem.upsert({
      where: { productId_warehouseId: { productId, warehouseId } },
      update: { quantity: { increment: quantity } },
      create: { productId, warehouseId, quantity: Math.max(0, quantity) },
    });
    await this.prisma.stockMovement.create({
      data: { stockItemId: item.id, type, quantity, reference },
    });
    return item;
  }

  async getLowStock() {
    const products = await this.prisma.product.findMany({
      include: { stockItems: true },
    });
    return products.filter(p => {
      const total = p.stockItems.reduce((s, i) => s + i.quantity, 0);
      return total <= p.minStock;
    });
  }

  findAllWarehouses() {
    return this.prisma.warehouse.findMany();
  }

  findAllCategories() {
    return this.prisma.productCategory.findMany();
  }
}
