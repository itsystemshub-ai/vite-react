import { Controller, Get, Post, Put, Param, Body, Query, UseGuards } from '@nestjs/common';
import { CrmService } from './crm.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('crm')
@UseGuards(JwtAuthGuard)
export class CrmController {
  constructor(private svc: CrmService) {}
  @Get('leads') leads(@Query('page') p = '1', @Query('limit') l = '20', @Query('status') s?: string) { return this.svc.findAll(+p, +l, s); }
  @Get('leads/stats') stats() { return this.svc.stats(); }
  @Post('leads') create(@Body() dto: any) { return this.svc.create(dto); }
  @Put('leads/:id') update(@Param('id') id: string, @Body() dto: any) { return this.svc.update(id, dto); }
  @Get('customers') customers(@Query('page') p = '1', @Query('limit') l = '20', @Query('search') s?: string) { return this.svc.findAllCustomers(+p, +l, s); }
  @Post('customers') createCustomer(@Body() dto: any) { return this.svc.createCustomer(dto); }
  @Put('customers/:id') updateCustomer(@Param('id') id: string, @Body() dto: any) { return this.svc.updateCustomer(id, dto); }
  @Get('suppliers') suppliers(@Query('page') p = '1', @Query('limit') l = '20') { return this.svc.findAllSuppliers(+p, +l); }
  @Post('suppliers') createSupplier(@Body() dto: any) { return this.svc.createSupplier(dto); }
}
