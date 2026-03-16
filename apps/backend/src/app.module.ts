import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { SalesModule } from './modules/sales/sales.module';
import { PurchasesModule } from './modules/purchases/purchases.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { AccountingModule } from './modules/accounting/accounting.module';
import { PayrollModule } from './modules/payroll/payroll.module';
import { CrmModule } from './modules/crm/crm.module';
import { TreasuryModule } from './modules/treasury/treasury.module';
import { FixedAssetsModule } from './modules/fixed-assets/fixed-assets.module';
import { ReportsModule } from './modules/reports/reports.module';
import { ConfigSystemModule } from './modules/config/config.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { CurrencyModule } from './modules/currency/currency.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    SalesModule,
    PurchasesModule,
    InventoryModule,
    AccountingModule,
    PayrollModule,
    CrmModule,
    TreasuryModule,
    FixedAssetsModule,
    ReportsModule,
    ConfigSystemModule,
    NotificationsModule,
    CurrencyModule,
  ],
})
export class AppModule {}
