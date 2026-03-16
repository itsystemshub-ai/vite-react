import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FixedAssetsService {
  constructor(private prisma: PrismaService) {}

  findAll() { return this.prisma.fixedAsset.findMany({ include: { category: true, location: true } }); }
  findOne(id: string) { return this.prisma.fixedAsset.findUnique({ where: { id }, include: { category: true, depreciations: true } }); }
  create(dto: any) { return this.prisma.fixedAsset.create({ data: { ...dto, acquisitionDate: new Date(dto.acquisitionDate), currentValue: dto.acquisitionCost } }); }
  findCategories() { return this.prisma.assetCategory.findMany(); }
  createCategory(dto: any) { return this.prisma.assetCategory.create({ data: dto }); }

  async runDepreciation(period: string) {
    const assets = await this.prisma.fixedAsset.findMany({ where: { status: 'ACTIVO' }, include: { category: true } });
    const results = [];
    for (const a of assets) {
      const monthly = (a.acquisitionCost - a.residualValue) / (a.usefulLifeYears * 12);
      if (monthly <= 0) continue;
      const accumulated = a.accumulatedDepreciation + monthly;
      const bookValue = a.acquisitionCost - accumulated;
      await this.prisma.fixedAsset.update({ where: { id: a.id }, data: { accumulatedDepreciation: accumulated, currentValue: bookValue } });
      const dep = await this.prisma.assetDepreciation.create({ data: { assetId: a.id, period, amount: monthly, accumulated, bookValue } });
      results.push(dep);
    }
    return results;
  }
}
