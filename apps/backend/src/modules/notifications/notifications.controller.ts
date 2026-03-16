import { Controller, Get, Patch, Param, Req, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private svc: NotificationsService) {}
  @Get() getAll(@Req() req: any) { return this.svc.getAll(req.user.sub); }
  @Get('unread') unread(@Req() req: any) { return this.svc.getUnread(req.user.sub); }
  @Get('count') count(@Req() req: any) { return this.svc.countUnread(req.user.sub); }
  @Patch(':id/read') markRead(@Param('id') id: string, @Req() req: any) { return this.svc.markAsRead(id, req.user.sub); }
  @Patch('read-all') markAllRead(@Req() req: any) { return this.svc.markAllAsRead(req.user.sub); }
}
