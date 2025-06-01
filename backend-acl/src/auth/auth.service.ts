import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateUser(email: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async generateToken(email: string) {
    try {
      const user = await this.validateUser(email);
      
      const payload = {
        email: user.email,
        userId: user._id
      };

      const token = this.jwtService.sign(payload);
      
      return {
        access_token: token,
        token_type: 'Bearer',
        expires_in: '1d'
      };
    } catch (error) {
      throw new UnauthorizedException('Failed to generate token');
    }
  }

  async verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
