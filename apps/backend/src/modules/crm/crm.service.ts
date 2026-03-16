import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CrmService {
  constructor(private prisma: PrismaService) {}

  findAll(page = 1, limit = 20, status?: string) {
    return this.prisma.lead.findMany({
      where: status ? { status: status as any } : undefined,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  create(dto: any) { return this.prisma.lead.create({ data: dto }); }
  update(id: string, dto: any) { return this.prisma.lead.update({ where: { id }, data: dto }); }

  async stats() {
    const byStatus = await this.prisma.lead.groupBy({ by: ['status'], _count: true });
    return byStatus;
  }

  // Customers
  findAllCustomers(page = 1, limit = 20, search?: string) {
    return this.prisma.customer.findMany({
      where: search ? { OR: [{ businessName: { contains: search, mode: 'insensitive' } }, { rif: { contains: search } }] } : undefined,
      orderBy: { businessName: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  createCustomer(dto: any) { return this.prisma.customer.create({ data: dto }); }
  updateCustomer(id: string, dto: any) { return this.prisma.customer.update({ where: { id }, data: dto }); }

  // Suppliers
  findAllSuppliers(page = 1, limit = 20) {
    return this.prisma.supplier.findMany({ orderBy: { businessName: 'asc' }, skip: (page - 1) * limit, take: limit });
  }
  createSupplier(dto: any) { return this.prisma.supplier.create({ data: dto }); }
}
