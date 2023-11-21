import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { loginDto } from './dto/login.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  signUp(@Body() dto: AuthDto) {
    return this.authService.signUp(dto);
  }
  @Post('signIn')
  signIn(@Body() logindto: loginDto, @Req() req, @Res() res) {
    return this.authService.signIn(logindto, req, res);
  }
  @Get('signOut')
  signOut(@Req() req, @Res() res) {
    return this.authService.signOut(req, res);
  }
}
