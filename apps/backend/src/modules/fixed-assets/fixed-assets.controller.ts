import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { FixedAssetsService } from './fixed-assets.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('fixed-assets')
@UseGuards(JwtAuthGuard)
export class FixedAssetsController {
  constructor(private svc: FixedAssetsService) {}
  @Get() findAll() { return this.svc.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.svc.findOne(id); }
  @Post() create(@Body() dto: any) { return this.svc.create(dto); }
  @Get('categories/all') categories() { return this.svc.findCategories(); }
  @Post('categories') createCategory(@Body() dto: any) { return this.svc.createCategory(dto); }
  @Post('depreciation/run') runDepreciation(@Body() dto: { period: string }) { return this.svc.runDepreciation(dto.period); }
}
