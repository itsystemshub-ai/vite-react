import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('purchases')
@UseGuards(JwtAuthGuard)
export class PurchasesController {
  constructor(private svc: PurchasesService) {}
  @Get() findAll(@Query('page') p = '1', @Query('limit') l = '20') { return this.svc.findAll(+p, +l); }
  @Get('stats') stats() { return this.svc.stats(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.svc.findOne(id); }
  @Post() create(@Body() dto: any) { return this.svc.create(dto); }
  @Patch(':id/receive') receive(@Param('id') id: string) { return this.svc.receive(id); }
}
