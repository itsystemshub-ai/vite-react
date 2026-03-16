import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('login')
  login(@Body() body: { email: string; password: string }, @Req() req: any) {
    return this.auth.login(body.email, body.password, req.ip);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Req() req: any) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    return this.auth.logout(token);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  profile(@Req() req: any) {
    return this.auth.getProfile(req.user.sub);
  }
}
