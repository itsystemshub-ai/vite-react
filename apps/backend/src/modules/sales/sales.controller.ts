import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { SalesService } from './sales.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('sales')
@UseGuards(JwtAuthGuard)
export class SalesController {
  constructor(private sales: SalesService) {}

  @Get() findAll(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.sales.findAll(+page, +limit);
  }
  @Get('stats') stats() { return this.sales.stats(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.sales.findOne(id); }
  @Post() create(@Body() dto: any) { return this.sales.create(dto); }
  @Patch(':id/invoice') invoice(@Param('id') id: string) { return this.sales.invoice(id); }
  @Patch(':id/cancel') cancel(@Param('id') id: string) { return this.sales.cancel(id); }
}
