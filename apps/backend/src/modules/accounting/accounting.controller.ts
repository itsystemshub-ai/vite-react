import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { AccountingService } from './accounting.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('accounting')
@UseGuards(JwtAuthGuard)
export class AccountingController {
  constructor(private svc: AccountingService) {}
  @Get('accounts') accounts() { return this.svc.findAllAccounts(); }
  @Get('entries') entries(@Query('page') p = '1', @Query('limit') l = '20') { return this.svc.findAllEntries(+p, +l); }
  @Post('entries') createEntry(@Body() dto: any) { return this.svc.createEntry(dto); }
  @Get('trial-balance') trialBalance(@Query('year') y: string, @Query('month') m: string) {
    return this.svc.getTrialBalance(+y || new Date().getFullYear(), +m || new Date().getMonth() + 1);
  }
  @Get('periods') periods() { return this.svc.getFiscalPeriods(); }
}
