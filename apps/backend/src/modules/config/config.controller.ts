import { Controller, Get, Post, Put, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ConfigSystemService } from './config.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('config')
@UseGuards(JwtAuthGuard)
export class ConfigSystemController {
  constructor(private svc: ConfigSystemService) {}
  @Get() findAll() { return this.svc.findAll(); }
  @Put(':key') upsert(@Param('key') key: string, @Body() dto: { value: string; group?: string }) { return this.svc.upsert(key, dto.value, dto.group); }
  @Post('bulk') bulk(@Body() dto: { configs: any[] }) { return this.svc.upsertMany(dto.configs); }
  @Get('schema/tables') tables() { return this.svc.getAllTables(); }
  @Get('schema/tables/:table/columns') columns(@Param('table') t: string) { return this.svc.getTableColumns(t); }
  @Get('schema/tables/:table/data') data(@Param('table') t: string, @Query('page') p = '1', @Query('limit') l = '50', @Query('orderBy') ob?: string, @Query('orderDir') od: 'ASC' | 'DESC' = 'ASC') { return this.svc.getTableData(t, +p, +l, ob, od); }
  @Get('schema/erd') erd() { return this.svc.getERDData(); }
}
