import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class CurrencyService {
  private readonly logger = new Logger(CurrencyService.name);
  constructor(private prisma: PrismaService) {}

  @Cron('0 15 * * 1-5', { timeZone: 'America/Caracas' })
  async syncBCV() {
    try {
      const { data: html } = await axios.get('https://www.bcv.org.ve/', { timeout: 10000 });
      const usdMatch = html.match(/id="dolar"[\s\S]*?<strong>([\d,]+)<\/strong>/);
      if (usdMatch) {
        const rate = parseFloat(usdMatch[1].replace(',', '.'));
        await this.saveRate('USD', 'VES', rate, 'BCV');
        this.logger.log(`BCV USD/VES: ${rate}`);
      }
    } catch (e) {
      this.logger.warn('No se pudo sincronizar BCV: ' + e.message);
    }
  }

  async saveRate(from: string, to: string, rate: number, source = 'MANUAL') {
    return this.prisma.exchangeRate.create({ data: { fromCurrency: from, toCurrency: to, rate, source } });
  }

  async getCurrentRate(from: string, to: string) {
    return this.prisma.exchangeRate.findFirst({
      where: { fromCurrency: from, toCurrency: to },
      orderBy: { date: 'desc' },
    });
  }

  getHistory(from: string, to: string, days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    return this.prisma.exchangeRate.findMany({
      where: { fromCurrency: from, toCurrency: to, date: { gte: since } },
      orderBy: { date: 'asc' },
    });
  }
}
