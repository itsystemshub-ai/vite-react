import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TreasuryService {
  constructor(private prisma: PrismaService) {}

  findAllAccounts() { return this.prisma.bankAccount.findMany(); }
  createAccount(dto: any) { return this.prisma.bankAccount.create({ data: dto }); }

  findTransactions(bankAccountId: string, page = 1, limit = 20) {
    return this.prisma.bankTransaction.findMany({
      where: { bankAccountId },
      orderBy: { date: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  createTransaction(dto: any) {
    return this.prisma.bankTransaction.create({ data: { ...dto, date: new Date(dto.date) } });
  }

  findPaymentOrders(status?: string) {
    return this.prisma.paymentOrder.findMany({
      where: status ? { status } : undefined,
      include: { bankAccount: true },
      orderBy: { dueDate: 'asc' },
    });
  }

  createPaymentOrder(dto: any) {
    return this.prisma.paymentOrder.create({ data: { ...dto, dueDate: new Date(dto.dueDate) } });
  }

  async getTotalBalance() {
    const r = await this.prisma.bankAccount.aggregate({ _sum: { balance: true } });
    return { totalBalance: r._sum.balance ?? 0 };
  }
}
