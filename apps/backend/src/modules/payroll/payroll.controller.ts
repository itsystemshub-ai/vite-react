import { Controller, Get, Post, Put, Param, Body, Query, UseGuards } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('payroll')
@UseGuards(JwtAuthGuard)
export class PayrollController {
  constructor(private svc: PayrollService) {}
  @Get('employees') employees(@Query('page') p = '1', @Query('limit') l = '20') { return this.svc.findAllEmployees(+p, +l); }
  @Post('employees') createEmployee(@Body() dto: any) { return this.svc.createEmployee(dto); }
  @Put('employees/:id') updateEmployee(@Param('id') id: string, @Body() dto: any) { return this.svc.updateEmployee(id, dto); }
  @Get('departments') departments() { return this.svc.findAllDepartments(); }
  @Get('payrolls') payrolls() { return this.svc.findAllPayrolls(); }
  @Post('process') process(@Body() dto: { period: string; paymentDate: string }) {
    return this.svc.processPayroll(dto.period, dto.paymentDate);
  }
}
