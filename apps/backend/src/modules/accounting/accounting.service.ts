import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccountingService {
  constructor(private prisma: PrismaService) {}

  findAllAccounts() {
    return this.prisma.account.findMany({ orderBy: { code: 'asc' } });
  }

  findAllEntries(page = 1, limit = 20) {
    return this.prisma.journalEntry.findMany({
      include: { items: { include: { account: true } } },
      orderBy: { date: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async createEntry(data: { date: Date; description: string; reference?: string; items: { accountCode: string; debit: number; credit: number; description?: string }[] }) {
    const accounts = await this.prisma.account.findMany({
      where: { code: { in: data.items.map(i => i.accountCode) } },
    });
    const accountMap = new Map(accounts.map(a => [a.code, a.id]));

    return this.prisma.journalEntry.create({
      data: {
        date: data.date,
        description: data.description,
        reference: data.reference,
        items: {
          create: data.items.map(i => ({
            accountId: accountMap.get(i.accountCode)!,
            debit: i.debit,
            credit: i.credit,
            description: i.description,
          })),
        },
      },
      include: { items: { include: { account: true } } },
    });
  }

  async getTrialBalance(year: number, month: number) {
    const start = new Date(year, 0, 1);
    const end = new Date(year, month, 0, 23, 59, 59);
    const accounts = await this.prisma.account.findMany({
      where: { level: 3 },
      include: {
        journalItems: {
          where: { journalEntry: { date: { gte: start, lte: end } } },
        },
      },
      orderBy: { code: 'asc' },
    });
    return accounts.map(a => ({
      code: a.code,
      name: a.name,
      type: a.type,
      debits: a.journalItems.reduce((s, i) => s + i.debit, 0),
      credits: a.journalItems.reduce((s, i) => s + i.credit, 0),
    })).filter(a => a.debits > 0 || a.credits > 0);
  }

  getFiscalPeriods() {
    return this.prisma.fiscalPeriod.findMany({ orderBy: [{ year: 'desc' }, { month: 'desc' }] });
  }
}
