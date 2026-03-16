import { Controller, Get, Post, Put, Param, Body, Query, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private svc: InventoryService) {}

  @Get('products') findAll(@Query('page') p = '1', @Query('limit') l = '20', @Query('search') s?: string) {
    return this.svc.findAllProducts(+p, +l, s);
  }
  @Get('products/low-stock') getLowStock() { return this.svc.getLowStock(); }
  @Get('products/:id') findOne(@Param('id') id: string) { return this.svc.findOneProduct(id); }
  @Post('products') create(@Body() dto: any) { return this.svc.createProduct(dto); }
  @Put('products/:id') update(@Param('id') id: string, @Body() dto: any) { return this.svc.updateProduct(id, dto); }
  @Get('warehouses') warehouses() { return this.svc.findAllWarehouses(); }
  @Get('categories') categories() { return this.svc.findAllCategories(); }
  @Post('adjust') adjust(@Body() dto: any) {
    return this.svc.adjustStock(dto.productId, dto.warehouseId, dto.quantity, dto.type, dto.reference);
  }
}
