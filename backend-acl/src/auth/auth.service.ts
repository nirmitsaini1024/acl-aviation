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
        userId: user._id,
        tenant_id: user.tenant_id,
        // Added for permissions
        sub: user._id,
        domain: user.domain,
        department: user.department,
        roles: user.roles || [], // Array of ObjectIds
        groups: user.groups || [] // Changed from groupIds to groups
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

  // Enhanced login method that checks roles
  async login(email: string) {
    try {
      const user = await this.validateUser(email);
      const tokenResponse = await this.generateToken(email);
      
      const hasRoles = (user.roles && user.roles.length > 0) || 
                      (user.groups && user.groups.length > 0);

      if (hasRoles) {

        // User has roles - return full response with permissions
        return {
          ...tokenResponse,
          user: {
            id: user._id?.toString() || user.id,
            email: user.email,
            domain: user.domain,
            department: user.department,
            firstName: user.firstName,
            lastName: user.lastName,
            jobTitle: user.jobTitle,
            hasRoles: true,
          },
          requiresPermissionFetch: true // Frontend should call /profile for permissions
        };
      } else {

        // User has no roles - return basic login response only
        return {
          ...tokenResponse,
          user: {
            id: user._id?.toString() || user.id,
            email: user.email,
            domain: user.domain,
            department: user.department,
            firstName: user.firstName,
            lastName: user.lastName,
            jobTitle: user.jobTitle,
            hasRoles: false
          },
          message: "Login successful. Contact administrator to assign roles for full access."
        };
      }
    } catch (error) {
      throw new UnauthorizedException('Failed to login');
    }
  }

  async getUserByEmail(email: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}