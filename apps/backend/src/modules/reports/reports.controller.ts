import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private svc: ReportsService) {}
  @Get('dashboard') dashboard() { return this.svc.getDashboard(); }
  @Get('sales-by-month') salesByMonth(@Query('year') y: string) { return this.svc.getSalesByMonth(+y || new Date().getFullYear()); }
  @Get('top-products') topProducts(@Query('limit') l = '10') { return this.svc.getTopProducts(+l); }
}
