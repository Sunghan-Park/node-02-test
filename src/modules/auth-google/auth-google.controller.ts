import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../authentication/auth.service';
import { Request, Response } from 'express';
import { User } from '../users/entities/user.entity';

@Controller('auth/google')
export class AuthGoogleController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    return;
  }

  @Get('login/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    console.log('Google auth callback - user:', req.user);
    const origin = req.headers.origin || req.headers.host || 'localhost';
    console.log('Origin:', origin);

    try {
      const tokens = this.authService.handleGoogleAuth(
        req.user as User,
        origin.toString(),
      );
      console.log('Tokens generated:', !!tokens);

      return res.status(200).json({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        message: 'Google 로그인 성공',
      });
    } catch (error) {
      console.error('Error in googleAuthRedirect:', error);
      return res.status(401).json({
        message: 'Authentication failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
