// ability/smart-permission.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactory } from '../ability.factory/ability.factory';

// Types
interface RequiredPermission {
  section: string;
  level: AccessLevelType;
}

interface RouteMapping {
  pattern: RegExp;
  method: string;
  permission: RequiredPermission;
}

type AccessLevelType = 'no_access' | 'view_access' | 'write_access' | 'admin_access';

@Injectable()
export class CaslAbilityGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: AbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    // Get route information
    const method = request.method; // GET, POST, PUT, DELETE
    const url = request.url; // /documents/in-review

    // Get user's flat permissions (all nested permissions flattened)
    const userPermissions = await this.getUserFlatPermissions(user);
    
    // Map route to permission requirement
    const requiredPermission = this.mapRouteToPermission(method, url);
    
    if (!requiredPermission) {
      return true; // No specific permission required
    }

    // Check permission directly from flattened structure
    const userAccessLevel = userPermissions[requiredPermission.section] || 'no_access';
    const hasPermission = this.hasRequiredAccessLevel(userAccessLevel, requiredPermission.level);
    
    if (!hasPermission) {
      throw new ForbiddenException(
        `Access denied: Requires ${requiredPermission.level} for ${requiredPermission.section}. You have: ${userAccessLevel}`
      );
    }

    return true;
  }

  async getUserFlatPermissions(user: any): Promise<Record<string, string>> {
    const roles = await this.abilityFactory.getUserRoles(user);
    const flatPermissions: Record<string, string> = {};

    roles.forEach(role => {
      this.flattenRolePermissions(role, '', flatPermissions);
    });

    return flatPermissions;
  }

  private flattenRolePermissions(obj: any, prefix: string, result: Record<string, string>): void {
    Object.keys(obj).forEach(key => {
      if (key.startsWith('_') || key === '__v') return; // Skip MongoDB fields

      const fullKey = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];

      if (this.isAccessLevelField(value)) {
        // Normalize access level (handle both hyphen and underscore formats)
        result[fullKey] = this.normalizeAccessLevel(value);
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Recursively flatten nested objects
        this.flattenRolePermissions(value, fullKey, result);
      }
    });
  }

  private normalizeAccessLevel(accessLevel: string): string {
    if (!accessLevel) return 'no_access';
    return accessLevel.replace(/-/g, '_');
  }

  private isAccessLevelField(value: any): boolean {
    if (typeof value !== 'string') return false;
    const normalized = this.normalizeAccessLevel(value);
    return ['no_access', 'view_access', 'write_access', 'admin_access'].includes(normalized);
  }

  private mapRouteToPermission(method: string, url: string): RequiredPermission | null {
    // Clean up URL (remove query parameters)
    const cleanUrl = url.split('?')[0];
    const pathParts = cleanUrl.split('/').filter(part => part.length > 0);

    // Route mapping rules
    const routeMappings: RouteMapping[] = [
      // Documents Routes
      {
        pattern: /^\/documents\/in-review$/,
        method: 'GET',
        permission: { section: 'documentRepoAccess.inReview.permission', level: 'view_access' }
      },
      {
        pattern: /^\/documents\/in-review$/,
        method: 'POST',
        permission: { section: 'documentRepoAccess.inReview.permission', level: 'write_access' }
      },
      {
        pattern: /^\/documents\/in-review\/[^\/]+$/,
        method: 'PUT',
        permission: { section: 'documentRepoAccess.inReview.permission', level: 'write_access' }
      },
      {
        pattern: /^\/documents\/in-review\/[^\/]+$/,
        method: 'DELETE',
        permission: { section: 'documentRepoAccess.inReview.permission', level: 'admin_access' }
      },
      {
        pattern: /^\/documents\/reference$/,
        method: 'GET',
        permission: { section: 'documentRepoAccess.referenceDocument', level: 'view_access' }
      },
      {
        pattern: /^\/documents\/reference$/,
        method: 'POST',
        permission: { section: 'documentRepoAccess.referenceDocument', level: 'write_access' }
      },
      {
        pattern: /^\/documents\/approved$/,
        method: 'GET',
        permission: { section: 'documentRepoAccess.approved', level: 'view_access' }
      },
      {
        pattern: /^\/documents\/deactivated$/,
        method: 'GET',
        permission: { section: 'documentRepoAccess.deactivated', level: 'view_access' }
      },
      {
        pattern: /^\/documents\/deactivated\/[^\/]+$/,
        method: 'PUT',
        permission: { section: 'documentRepoAccess.deactivated', level: 'write_access' }
      },
      {
        pattern: /^\/documents\/deactivated\/[^\/]+$/,
        method: 'DELETE',
        permission: { section: 'documentRepoAccess.deactivated', level: 'admin_access' }
      },

      // Review Routes
      {
        pattern: /^\/review\/admin$/,
        method: 'GET',
        permission: { section: 'reviewAdministration.reviewAdministrationAccess.permission', level: 'view_access' }
      },
      {
        pattern: /^\/review\/upload$/,
        method: 'POST',
        permission: { section: 'reviewAdministration.reviewAdministrationAccess.upload.permission', level: 'write_access' }
      },
      {
        pattern: /^\/review\/upload\/working-copy$/,
        method: 'POST',
        permission: { section: 'reviewAdministration.reviewAdministrationAccess.upload.actions.uploadWorkingCopy', level: 'write_access' }
      },
      {
        pattern: /^\/review\/upload\/reference$/,
        method: 'POST',
        permission: { section: 'reviewAdministration.reviewAdministrationAccess.upload.actions.uploadReferenceDocument', level: 'write_access' }
      },
      {
        pattern: /^\/review\/sign-off$/,
        method: 'GET',
        permission: { section: 'reviewAdministration.reviewAdministrationAccess.signOff', level: 'view_access' }
      },
      {
        pattern: /^\/review\/sign-off$/,
        method: 'POST',
        permission: { section: 'reviewAdministration.reviewAdministrationAccess.signOff', level: 'write_access' }
      },
      {
        pattern: /^\/review\/management$/,
        method: 'GET',
        permission: { section: 'reviewAdministration.reviewManagement', level: 'view_access' }
      },
      {
        pattern: /^\/review\/admin-repo-view$/,
        method: 'GET',
        permission: { section: 'reviewAdministration.adminDocumentRepositoryView.permission', level: 'view_access' }
      },
      {
        pattern: /^\/review\/admin-repo-view\/pending$/,
        method: 'GET',
        permission: { section: 'reviewAdministration.adminDocumentRepositoryView.pending', level: 'view_access' }
      },
      {
        pattern: /^\/review\/admin-repo-view\/approved$/,
        method: 'GET',
        permission: { section: 'reviewAdministration.adminDocumentRepositoryView.approved.permission', level: 'view_access' }
      },
      {
        pattern: /^\/review\/admin-repo-view\/approved\/final-copy\/[^\/]+$/,
        method: 'PUT',
        permission: { section: 'reviewAdministration.adminDocumentRepositoryView.approved.actions.finalCopy', level: 'write_access' }
      },
      {
        pattern: /^\/review\/admin-repo-view\/approved\/summary$/,
        method: 'GET',
        permission: { section: 'reviewAdministration.adminDocumentRepositoryView.approved.actions.summary', level: 'view_access' }
      },
      {
        pattern: /^\/review\/admin-repo-view\/approved\/annotated\/[^\/]+$/,
        method: 'DELETE',
        permission: { section: 'reviewAdministration.adminDocumentRepositoryView.approved.actions.annotatedDocs', level: 'admin_access' }
      },
      {
        pattern: /^\/review\/admin-repo-view\/reference$/,
        method: 'GET',
        permission: { section: 'reviewAdministration.adminDocumentRepositoryView.referenceDocuments', level: 'view_access' }
      },

      // Tasks Routes
      {
        pattern: /^\/tasks$/,
        method: 'GET',
        permission: { section: 'taskManagement', level: 'view_access' }
      },
      {
        pattern: /^\/tasks$/,
        method: 'POST',
        permission: { section: 'taskManagement', level: 'write_access' }
      },
      {
        pattern: /^\/tasks\/[^\/]+$/,
        method: 'PUT',
        permission: { section: 'taskManagement', level: 'write_access' }
      },
      {
        pattern: /^\/tasks\/[^\/]+$/,
        method: 'DELETE',
        permission: { section: 'taskManagement', level: 'admin_access' }
      },

      // Users Routes
      {
        pattern: /^\/users$/,
        method: 'GET',
        permission: { section: 'userManagement', level: 'view_access' }
      },
      {
        pattern: /^\/users$/,
        method: 'POST',
        permission: { section: 'userManagement', level: 'write_access' }
      },
      {
        pattern: /^\/users\/[^\/]+$/,
        method: 'PUT',
        permission: { section: 'userManagement', level: 'write_access' }
      },
      {
        pattern: /^\/users\/[^\/]+$/,
        method: 'DELETE',
        permission: { section: 'userManagement', level: 'admin_access' }
      },

      // Reports Routes
      {
        pattern: /^\/reports$/,
        method: 'GET',
        permission: { section: 'reportAccess', level: 'view_access' }
      },
      {
        pattern: /^\/reports$/,
        method: 'POST',
        permission: { section: 'reportAccess', level: 'write_access' }
      },

      // Add more route patterns as needed...
    ];

    // Find matching route
    for (const mapping of routeMappings) {
      if (mapping.pattern.test(cleanUrl) && mapping.method === method) {
        return mapping.permission;
      }
    }

    // If no specific mapping found, try to infer from URL structure
    return this.inferPermissionFromUrl(method, pathParts);
  }

  private inferPermissionFromUrl(method: string, pathParts: string[]): RequiredPermission | null {
    if (pathParts.length === 0) return null;

    const controller = pathParts[0]; // documents, tasks, users, etc.
    const action = pathParts[1]; // in-review, approved, etc.

    // Basic inference rules
    const baseSection = this.mapControllerToSection(controller, action);
    if (!baseSection) return null;

    const requiredLevel = this.mapMethodToAccessLevel(method);

    return {
      section: baseSection,
      level: requiredLevel
    };
  }

  private mapControllerToSection(controller: string, action?: string): string | null {
    const mappings: Record<string, string> = {
      'documents': action ? `documentRepoAccess.${action}` : 'documentRepoAccess',
      'tasks': 'taskManagement',
      'users': 'userManagement',
      'reports': 'reportAccess',
      'review': 'reviewAdministration'
    };

    return mappings[controller] || null;
  }

  private mapMethodToAccessLevel(method: string): AccessLevelType {
    switch (method) {
      case 'GET':
        return 'view_access';
      case 'POST':
      case 'PUT':
      case 'PATCH':
        return 'write_access';
      case 'DELETE':
        return 'admin_access';
      default:
        return 'view_access';
    }
  }

  private hasRequiredAccessLevel(userLevel: string, requiredLevel: string): boolean {
    const levels = {
      'no_access': 0,
      'view_access': 1,
      'write_access': 2,
      'admin_access': 3
    };

    const userLevelValue = levels[userLevel] || 0;
    const requiredLevelValue = levels[requiredLevel] || 0;

    return userLevelValue >= requiredLevelValue;
  }
}
