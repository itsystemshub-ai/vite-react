import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PayrollService {
  constructor(private prisma: PrismaService) {}

  findAllEmployees(page = 1, limit = 20) {
    return this.prisma.employee.findMany({
      include: { department: true },
      orderBy: { lastName: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  createEmployee(dto: any) {
    return this.prisma.employee.create({ data: { ...dto, hireDate: new Date(dto.hireDate) } });
  }

  updateEmployee(id: string, dto: any) {
    return this.prisma.employee.update({ where: { id }, data: dto });
  }

  findAllDepartments() {
    return this.prisma.department.findMany();
  }

  async processPayroll(period: string, paymentDate: string) {
    const employees = await this.prisma.employee.findMany({ where: { status: 'ACTIVE' } });
    const items = employees.map(e => {
      const baseSalary = e.salary;
      const cestaticket = 130;
      const deductions = baseSalary * 0.04; // SSO simplificado
      const netPay = baseSalary + cestaticket - deductions;
      return { employeeId: e.id, baseSalary, overtime: 0, bonuses: cestaticket, deductions, netPay };
    });

    const total = items.reduce((s, i) => s + i.netPay, 0);
    return this.prisma.payroll.create({
      data: {
        period,
        paymentDate: new Date(paymentDate),
        total,
        items: { create: items },
      },
      include: { items: { include: { employee: true } } },
    });
  }

  findAllPayrolls() {
    return this.prisma.payroll.findMany({ orderBy: { createdAt: 'desc' } });
  }
}
