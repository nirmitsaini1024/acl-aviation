import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const token = await this.authService.generateToken(loginDto.email);
    
    // Set the token in an HTTP-only cookie
    res.cookie('jwt', token.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    });

    return res.json({
      message: 'Login successful',
      access_token: token.access_token,
      token_type: token.token_type,
      expires_in: token.expires_in
    });
  }
}
