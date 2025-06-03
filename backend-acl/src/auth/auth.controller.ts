import { Controller, Post, Get, Body, Res, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { AbilityFactory } from 'src/ability/ability.factory/ability.factory';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ActionsEnum } from 'src/ability/enums/actions.enum';
import { SubjectsType } from 'src/ability/enums/subjects.type';

// DTOs for permission checking
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
    // Generate token (your existing logic)
    const token = await this.authService.generateToken(loginDto.email);
    
    // Get user data for permissions
    const user = await this.authService.getUserByEmail(loginDto.email);
    console.log("Raw user from DB:", JSON.stringify(user, null, 2));
    
    // Transform user to the format expected by AbilityFactory
    const userForAbility = this.transformUserForAbility(user);
    console.log("Transformed user for ability:", JSON.stringify(userForAbility, null, 2));
    
    // Get user permissions using the ability factory
    const permissions = await this.getUserPermissions(userForAbility);
    
    // Set the token in an HTTP-only cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    });

    // Return success message with permissions
    const safeUser = {
      id: user._id?.toString() || user.id,
      email: user.email,
      domain: user.domain,
      department: user.department,
      firstName: user.firstName,
      lastName: user.lastName,
      jobTitle: user.jobTitle,
    };

    return res.json({ 
      message: 'Login successful',
      token,
      user: safeUser,
      permissions
    });
  }

  // New endpoint to get current user permissions
  @Get('permissions')
  @UseGuards(JwtAuthGuard)
  async getCurrentUserPermissions(@Request() req) {
    const user = await this.authService.getUserByEmail(req.user.email);
    const userForAbility = this.transformUserForAbility(user);
    return this.getUserPermissions(userForAbility);
  }

  // New endpoint to check specific permission
  @Post('check-permission')
  @UseGuards(JwtAuthGuard)
  async checkPermission(@Request() req, @Body() checkDto: PermissionCheckDto) {
    const user = await this.authService.getUserByEmail(req.user.email);
    const userForAbility = this.transformUserForAbility(user);
    const ability = await this.abilityFactory.createForUser(userForAbility);
    
    const canAccess = checkDto.conditions 
      ? ability.can(checkDto.action, checkDto.subject, checkDto.conditions)
      : ability.can(checkDto.action, checkDto.subject);

    return { canAccess };
  }

  // NEW: Transform user object to AbilityFactory expected format
  private transformUserForAbility(user: any) {
    // Convert Mongoose document to plain object if needed
    const plainUser = user.toObject ? user.toObject() : user;
    
    console.log("Plain user:", JSON.stringify(plainUser, null, 2));
    
    return {
      id: plainUser._id?.toString() || plainUser.id,
      email: plainUser.email,
      domain: plainUser.domain,
      department: plainUser.department,
      // Map your user's role/group fields to the expected format
      roleIds: plainUser.roles?.map((role: any) => 
        typeof role === 'string' ? role : role._id?.toString() || role.id
      ) || plainUser.roleIds || [],
      groupIds: plainUser.groups?.map((group: any) => 
        typeof group === 'string' ? group : group._id?.toString() || group.id
      ) || plainUser.groupIds || []
    };
  }

  // Helper method to structure permissions for frontend
  private async getUserPermissions(userForAbility: any) {
    console.log("Getting permissions for user:", JSON.stringify(userForAbility, null, 2));
    
    const abilitySummary = await this.abilityFactory.getUserAbilitiesSummary(userForAbility);
    
    console.log("Ability summary:", JSON.stringify(abilitySummary, null, 2));
    
    // Check if permissions exist and are in the expected format
    if (!abilitySummary.permissions || !Array.isArray(abilitySummary.permissions)) {
      console.warn("No permissions found or permissions not in expected format");
      return this.getEmptyPermissions();
    }
    
    // Transform permissions into frontend-friendly format
    const permissionMap = this.buildPermissionMap(abilitySummary.permissions);
    
    return {
      // Raw permissions for complex checks
      raw: abilitySummary.permissions,
      
      // Structured permissions for easy frontend consumption
      documents: {
        inReview: {
          canRead: permissionMap.canRead('Document', { category: 'inReview' }),
          canCreate: permissionMap.canCreate('Document', { category: 'inReview' }),
          canUpdate: permissionMap.canUpdate('Document', { category: 'inReview' }),
          canDelete: permissionMap.canDelete('Document', { category: 'inReview' }),
          canUpload: permissionMap.canUpload('Document', { category: 'inReview' })
        },
        reference: {
          canRead: permissionMap.canRead('ReferenceDocument'),
          canCreate: permissionMap.canCreate('ReferenceDocument'),
          canUpload: permissionMap.canUpload('ReferenceDocument')
        },
        approved: {
          canRead: permissionMap.canRead('Document', { status: 'approved' }),
          canDownload: permissionMap.canDownload('Document', { status: 'approved' })
        },
        deactivated: {
          canRead: permissionMap.canRead('Document', { status: 'deactivated' })
        }
      },
      
      // Review permissions
      reviews: {
        canManage: permissionMap.canManage('Review'),
        canCreate: permissionMap.canCreate('Review'),
        canSignOff: permissionMap.canApprove('Document'),
        canNotify: permissionMap.canNotify()
      },
      
      // Admin permissions
      admin: {
        canAccessAdminPanel: permissionMap.hasAnyAdminAccess(),
        canManageUsers: permissionMap.canManage('User'),
        canViewReports: permissionMap.canRead('Report')
      },
      
      // UI-specific permissions
      ui: {
        showUploadButton: permissionMap.canUpload('Document'),
        showDeleteButton: permissionMap.canDelete('Document'),
        showAdminMenu: permissionMap.hasAnyAdminAccess(),
        showReviewSection: permissionMap.canRead('Review') || permissionMap.canManage('Review'),
        showNotificationCenter: permissionMap.canNotify()
      }
    };
  }

  // NEW: Return empty permissions structure when no permissions found
  private getEmptyPermissions() {
    return {
      raw: [],
      documents: {
        inReview: { canRead: false, canCreate: false, canUpdate: false, canDelete: false, canUpload: false },
        reference: { canRead: false, canCreate: false, canUpload: false },
        approved: { canRead: false, canDownload: false },
        deactivated: { canRead: false }
      },
      reviews: { canManage: false, canCreate: false, canSignOff: false, canNotify: false },
      admin: { canAccessAdminPanel: false, canManageUsers: false, canViewReports: false },
      ui: { showUploadButton: false, showDeleteButton: false, showAdminMenu: false, showReviewSection: false, showNotificationCenter: false }
    };
  }

  private buildPermissionMap(permissions: any[]) {
    return {
      canRead: (subject: string, conditions?: any) =>
        Array.isArray(permissions) &&
        permissions.some(
          p =>
            p.subject === subject &&
            p.action === 'read' &&
            this.matchesConditions(p.conditions, conditions)
        ),

      canCreate: (subject: string, conditions?: any) =>
        Array.isArray(permissions) &&
        permissions.some(
          p =>
            p.subject === subject &&
            ['create', 'manage'].includes(p.action) &&
            this.matchesConditions(p.conditions, conditions)
        ),

      canUpdate: (subject: string, conditions?: any) =>
        Array.isArray(permissions) &&
        permissions.some(
          p =>
            p.subject === subject &&
            ['update', 'manage'].includes(p.action) &&
            this.matchesConditions(p.conditions, conditions)
        ),

      canDelete: (subject: string, conditions?: any) =>
        Array.isArray(permissions) &&
        permissions.some(
          p =>
            p.subject === subject &&
            ['delete', 'manage'].includes(p.action) &&
            this.matchesConditions(p.conditions, conditions)
        ),

      canUpload: (subject: string, conditions?: any) =>
        Array.isArray(permissions) &&
        permissions.some(
          p =>
            p.subject === subject &&
            ['upload', 'manage'].includes(p.action) &&
            this.matchesConditions(p.conditions, conditions)
        ),

      canDownload: (subject: string, conditions?: any) =>
        Array.isArray(permissions) &&
        permissions.some(
          p =>
            p.subject === subject &&
            ['download', 'read', 'manage'].includes(p.action) &&
            this.matchesConditions(p.conditions, conditions)
        ),

      canApprove: (subject: string, conditions?: any) =>
        Array.isArray(permissions) &&
        permissions.some(
          p =>
            p.subject === subject &&
            ['approve', 'manage'].includes(p.action) &&
            this.matchesConditions(p.conditions, conditions)
        ),

      canNotify: () =>
        Array.isArray(permissions) &&
        permissions.some(
          p => p.subject === 'Notification' && ['notify', 'manage'].includes(p.action)
        ),

      canManage: (subject: string, conditions?: any) =>
        Array.isArray(permissions) &&
        permissions.some(
          p =>
            p.subject === subject &&
            p.action === 'manage' &&
            this.matchesConditions(p.conditions, conditions)
        ),

      hasAnyAdminAccess: () =>
        Array.isArray(permissions) &&
        permissions.some(p => p.accessLevel === 'admin_access')
    };
  }

  private matchesConditions(permissionConditions: any, checkConditions: any): boolean {
    if (!checkConditions) return true;
    if (!permissionConditions) return false;
    
    return Object.keys(checkConditions).every(key => 
      permissionConditions[key] === checkConditions[key]
    );
  }
}