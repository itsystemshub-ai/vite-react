import { Controller, Get, Post, Put, Param, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private svc: UsersService) {}
  @Get() findAll() { return this.svc.findAll(); }
  @Get('roles') roles() { return this.svc.findAllRoles(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.svc.findOne(id); }
  @Post() create(@Body() dto: any) { return this.svc.create(dto); }
  @Put(':id') update(@Param('id') id: string, @Body() dto: any) { return this.svc.update(id, dto); }
}
