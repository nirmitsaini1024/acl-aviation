import { Controller, Post, Get, Body, Res, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { AbilityFactory } from 'src/ability/ability.factory/ability.factory';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ActionsEnum } from 'src/ability/enums/actions.enum';
import { SubjectsType } from 'src/ability/enums/subjects.type';

export class PermissionCheckDto {
  action: ActionsEnum;
  subject: SubjectsType;
  conditions?: any;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly abilityFactory: AbilityFactory
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const token = await this.authService.generateToken(loginDto.email);
    const user = await this.authService.getUserByEmail(loginDto.email);
    
    // Transform user to the format expected by AbilityFactory
    const userForAbility = this.transformUserForAbility(user);
    
    // Get user permissions
    const permissions = await this.abilityFactory.getUserAbilitiesSummary(userForAbility);
    
    // Set the token in an HTTP-only cookie
    res.cookie('jwt', token.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Clean user data for response
    const safeUser = {
      id: user._id?.toString() || user.id,
      email: user.email,
      domain: user.domain,
      department: user.department,
      firstName: user.firstName,
      lastName: user.lastName,
      jobTitle: user.jobTitle,
    };

    return {
      message: 'Login successful',
      token: token.access_token,
      user: safeUser,
      permissions: permissions.permissions, // Return the nested permission structure
      roles: permissions.roles,
      totalRoles: permissions.totalRoles
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    const user = await this.authService.getUserByEmail(req.user.email);
    const userForAbility = this.transformUserForAbility(user);
    const permissions = await this.abilityFactory.getUserAbilitiesSummary(userForAbility);

    const safeUser = {
      id: user._id?.toString() || user.id,
      email: user.email,
      domain: user.domain,
      department: user.department,
      firstName: user.firstName,
      lastName: user.lastName,
      jobTitle: user.jobTitle,
    };

    return {
      user: safeUser,
      permissions: permissions.permissions,
      roles: permissions.roles,
      totalRoles: permissions.totalRoles
    };
  }

  @Post('check-permission')
  @UseGuards(JwtAuthGuard)
  async checkPermission(@Request() req, @Body() checkDto: PermissionCheckDto) {
    const user = await this.authService.getUserByEmail(req.user.email);
    const userForAbility = this.transformUserForAbility(user);
    const ability = await this.abilityFactory.createForUser(userForAbility);
    
    const canAccess = checkDto.conditions 
      ? ability.can(checkDto.action, checkDto.subject, checkDto.conditions)
      : ability.can(checkDto.action, checkDto.subject);

    return { 
      canAccess,
      action: checkDto.action,
      subject: checkDto.subject,
      conditions: checkDto.conditions 
    };
  }

  // Transform user object to AbilityFactory expected format
  private transformUserForAbility(user: any) {
    const plainUser = user.toObject ? user.toObject() : user;
    
    return {
      id: plainUser._id?.toString() || plainUser.id,
      email: plainUser.email,
      domain: plainUser.domain,
      department: plainUser.department,
      roleIds: plainUser.roles?.map((role: any) => 
        typeof role === 'string' ? role : role._id?.toString() || role.id
      ) || plainUser.roleIds || [],
      groupIds: plainUser.groups?.map((group: any) => 
        typeof group === 'string' ? group : group._id?.toString() || group.id
      ) || plainUser.groupIds || []
    };
  }
}