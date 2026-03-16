import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { TreasuryService } from './treasury.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('treasury')
@UseGuards(JwtAuthGuard)
export class TreasuryController {
  constructor(private svc: TreasuryService) {}
  @Get('accounts') accounts() { return this.svc.findAllAccounts(); }
  @Post('accounts') createAccount(@Body() dto: any) { return this.svc.createAccount(dto); }
  @Get('accounts/balance') balance() { return this.svc.getTotalBalance(); }
  @Get('accounts/:id/transactions') transactions(@Param('id') id: string, @Query('page') p = '1') { return this.svc.findTransactions(id, +p); }
  @Post('transactions') createTx(@Body() dto: any) { return this.svc.createTransaction(dto); }
  @Get('payment-orders') orders(@Query('status') s?: string) { return this.svc.findPaymentOrders(s); }
  @Post('payment-orders') createOrder(@Body() dto: any) { return this.svc.createPaymentOrder(dto); }
}
