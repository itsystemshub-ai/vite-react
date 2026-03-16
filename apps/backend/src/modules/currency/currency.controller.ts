import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('currency')
@UseGuards(JwtAuthGuard)
export class CurrencyController {
  constructor(private svc: CurrencyService) {}
  @Get('rate') rate(@Query('from') from = 'USD', @Query('to') to = 'VES') { return this.svc.getCurrentRate(from, to); }
  @Get('history') history(@Query('from') from = 'USD', @Query('to') to = 'VES', @Query('days') days = '30') { return this.svc.getHistory(from, to, +days); }
  @Post('rate') saveRate(@Body() dto: { from: string; to: string; rate: number }) { return this.svc.saveRate(dto.from, dto.to, dto.rate); }
  @Post('sync') sync() { return this.svc.syncBCV(); }
}
