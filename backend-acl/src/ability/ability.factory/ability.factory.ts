// ability/ability.factory.ts - COMPLETE VERSION
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbilityBuilder, Ability, AbilityClass, ExtractSubjectType } from '@casl/ability';
import { ActionsEnum } from '../enums/actions.enum';
import { AccessLevel} from '../enums/access-level.enum';
import {SubjectsType} from '../enums/subjects.type';

// Interfaces
export interface BaseRole {
  _id: string;
  domain?: string;
  department?: string;
  roleName: string;
  roleTitle?: string;
  description?: string;
  userIds?: string[];
  groupIds?: string[];
  documentRepoAccess?: any;
  reviewAdministration?: any;
  [key: string]: any; // Allow any additional fields with access levels
}

export interface ProcessedPermission {
  subject: string;
  action: ActionsEnum;
  accessLevel: AccessLevel;
  conditions?: Record<string, any>;
  fields?: string[];
  context?: Record<string, any>;
}

export interface UserWithRoles {
  id: string;
  email: string;
  domain?: string;
  department?: string;
  roleIds?: string[];
  groupIds?: string[];
  [key: string]: any;
}

type AppAbility = Ability<[ActionsEnum, SubjectsType]>;

@Injectable()
export class AbilityFactory {
  constructor(
    @InjectModel('Role') private roleModel: Model<BaseRole>,
    @InjectModel('Group') private groupModel: Model<any>,
  ) {}

  async createForUser(user: UserWithRoles): Promise<AppAbility> {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      Ability as AbilityClass<AppAbility>
    );

    if (!user) {
      return build({
        detectSubjectType: (item: any) =>
            item?.__caslSubjectType__ ?? item?.constructor?.name,
        });
      }

    // Get all roles for the user (direct + group roles)
    const userRoles = await this.getUserRoles(user);

    // Process all permissions from roles
    const allPermissions = this.extractPermissionsFromRoles(userRoles, user);

    // Apply permissions to CASL
    allPermissions.forEach(permission => {
      this.applyPermission(can, cannot, permission, user);
    });

    return build({
      detectSubjectType: (item: any) =>
          item?.__caslSubjectType__ ?? item?.constructor?.name,
    });
  }

  async getUserAbilitiesSummary(user: UserWithRoles): Promise<any> {
    console.log('=== DEBUGGING USER ABILITIES ===');
    console.log('Input user:', JSON.stringify(user, null, 2));
    
    const roles = await this.getUserRoles(user);
    console.log('Found roles count:', roles.length);
    console.log('Raw roles data:', JSON.stringify(roles, null, 2));
    
    const permissions = this.extractPermissionsFromRoles(roles, user);
    console.log('Extracted permissions count:', permissions.length);
    console.log('Permissions:', JSON.stringify(permissions, null, 2));
    
    // Ensure completely clean objects without any circular references
    const cleanPermissions = permissions.map(perm => ({
      subject: perm.subject,
      action: perm.action,
      accessLevel: perm.accessLevel,
      conditions: perm.conditions ? JSON.parse(JSON.stringify(perm.conditions)) : undefined,
      fields: perm.fields ? [...perm.fields] : undefined,
      context: perm.context ? JSON.parse(JSON.stringify(perm.context)) : undefined
    }));
    
    // Clean roles data to avoid circular references
    const cleanRoles = roles.map(role => ({
      id: role._id?.toString(),
      name: role.roleName,
      title: role.roleTitle,
      domain: role.domain,
      department: role.department,
      description: role.description
    }));
    
    console.log('=== END DEBUGGING ===');
    
    return {
      totalRoles: roles.length,
      totalPermissions: cleanPermissions.length,
      permissions: cleanPermissions,
      roles: cleanRoles
    };
  }

  private async getUserRoles(user: UserWithRoles): Promise<BaseRole[]> {
    const roles: BaseRole[] = [];

    // Get direct user roles
    if (user.roleIds?.length) {
      const userRoles = await this.roleModel.find({
        _id: { $in: user.roleIds }
      }).lean().exec(); // Use .lean() to get plain objects
      roles.push(...userRoles);
    }

    // Get roles from user groups
    if (user.groupIds?.length) {
      const userGroups = await this.groupModel.find({
        _id: { $in: user.groupIds }
      }).lean().exec(); // Use .lean() to get plain objects

      for (const group of userGroups) {
        if (group.roleIds?.length) {
          const groupRoles = await this.roleModel.find({
            _id: { $in: group.roleIds }
          }).lean().exec(); // Use .lean() to get plain objects
          roles.push(...groupRoles);
        }
      }
    }

    // Remove duplicate roles
    return this.removeDuplicateRoles(roles);
  }

  private removeDuplicateRoles(roles: BaseRole[]): BaseRole[] {
    const uniqueRoles = new Map<string, BaseRole>();
    
    roles.forEach(role => {
      const existingRole = uniqueRoles.get(role._id);
      if (!existingRole || this.shouldReplaceRole(existingRole, role)) {
        uniqueRoles.set(role._id, role);
      }
    });

    return Array.from(uniqueRoles.values());
  }

  private shouldReplaceRole(existing: BaseRole, current: BaseRole): boolean {
    // Logic to determine which role takes precedence
    // Can be based on access levels, priority, etc.
    return false; // Default: keep existing
  }

  private extractPermissionsFromRoles(roles: BaseRole[], user: UserWithRoles): ProcessedPermission[] {
    const permissions: ProcessedPermission[] = [];

    roles.forEach(role => {
      // Process each field in the role that has access level
      Object.keys(role).forEach(key => {
        if (this.isAccessLevelField(role[key])) {
          const permission = this.convertToPermission(key, role[key], role, user);
          if (permission) {
            permissions.push(permission);
          }
        } else if (this.isNestedPermissionsObject(role[key])) {
          // Handle nested objects like documentRepoAccess
          const nestedPermissions = this.extractNestedPermissions(key, role[key], role, user);
          permissions.push(...nestedPermissions);
        } else if (Array.isArray(role[key])) {
          // Handle permission arrays
          const arrayPermissions = this.extractArrayPermissions(key, role[key], role, user);
          permissions.push(...arrayPermissions);
        }
      });
    });

    return this.mergePermissions(permissions);
  }

  private isAccessLevelField(value: any): boolean {
    return typeof value === 'string' && Object.values(AccessLevel).includes(value as AccessLevel);
  }

  private isNestedPermissionsObject(value: any): boolean {
    return value && 
           typeof value === 'object' && 
           !Array.isArray(value) && 
           Object.values(value).some(v => this.isAccessLevelField(v) || (typeof v === 'object' && v !== null));
  }

  private convertToPermission(
    fieldName: string, 
    accessLevel: string, 
    role: BaseRole, 
    user: UserWithRoles
  ): ProcessedPermission | null {
    // Map field names to subjects and actions
    const fieldMapping = this.getFieldMapping();
    const mapping = fieldMapping[fieldName];

    if (!mapping) {
      // Dynamic mapping for unknown fields
      return {
        subject: this.inferSubjectFromFieldName(fieldName),
        action: this.inferActionFromFieldName(fieldName),
        accessLevel: accessLevel as AccessLevel,
        conditions: {
          domain: role.domain,
          department: role.department
        }
      };
    }

    return {
      subject: mapping.subject,
      action: mapping.action,
      accessLevel: accessLevel as AccessLevel,
      conditions: {
        ...mapping.conditions,
        domain: role.domain,
        department: role.department
      },
      fields: mapping.fields
    };
  }

  private extractNestedPermissions(
    parentKey: string,
    nestedObj: Record<string, any>,
    role: BaseRole,
    user: UserWithRoles
  ): ProcessedPermission[] {
    const permissions: ProcessedPermission[] = [];

    Object.keys(nestedObj).forEach(key => {
      const value = nestedObj[key];
      
      if (this.isAccessLevelField(value)) {
        // Direct access level field
        const fullKey = `${parentKey}.${key}`;
        const permission = this.convertToPermission(fullKey, value, role, user);
        if (permission) {
          permissions.push(permission);
        }
      } else if (typeof value === 'object' && value !== null) {
        // Check for nested structure with 'permission' and 'actions'
        if (value.permission && this.isAccessLevelField(value.permission)) {
          const fullKey = `${parentKey}.${key}.permission`;
          const permission = this.convertToPermission(fullKey, value.permission, role, user);
          if (permission) {
            permissions.push(permission);
          }
        }
        
        // Process 'actions' object if it exists
        if (value.actions && typeof value.actions === 'object') {
          const actionsPermissions = this.extractNestedPermissions(
            `${parentKey}.${key}.actions`,
            value.actions,
            role,
            user
          );
          permissions.push(...actionsPermissions);
        }
        
        // Recursively process other nested objects
        const nestedPermissions = this.extractNestedPermissions(
          `${parentKey}.${key}`,
          value,
          role,
          user
        );
        permissions.push(...nestedPermissions);
      }
    });

    return permissions;
  }

  private extractArrayPermissions(
    arrayKey: string,
    permArray: any[],
    role: BaseRole,
    user: UserWithRoles
  ): ProcessedPermission[] {
    const permissions: ProcessedPermission[] = [];

    permArray.forEach((item, index) => {
      if (typeof item === 'object') {
        Object.keys(item).forEach(key => {
          if (this.isAccessLevelField(item[key])) {
            const fullKey = `${arrayKey}[${index}].${key}`;
            const permission = this.convertToPermission(fullKey, item[key], role, user);
            if (permission) {
              permissions.push(permission);
            }
          }
        });
      }
    });

    return permissions;
  }

  private getFieldMapping(): Record<string, any> {
    return {
      // Document Repository Access mappings
      'documentRepoAccess.inReview.permission': {
        subject: 'Document',
        action: ActionsEnum.MANAGE,
        conditions: { category: 'inReview' }
      },
      'documentRepoAccess.inReview.actions.referenceDocumentAccess': {
        subject: 'ReferenceDocument',
        action: ActionsEnum.READ,
        conditions: { context: 'inReview' }
      },
      'documentRepoAccess.inReview.actions.notify': {
        subject: 'Notification',
        action: ActionsEnum.NOTIFY,
        conditions: { context: 'inReview' }
      },
      'documentRepoAccess.referenceDocument': {
        subject: 'ReferenceDocument',
        action: ActionsEnum.READ
      },
      'documentRepoAccess.approved': {
        subject: 'Document',
        action: ActionsEnum.READ,
        conditions: { status: 'approved' }
      },
      'documentRepoAccess.deactivated': {
        subject: 'Document',
        action: ActionsEnum.READ,
        conditions: { status: 'deactivated' }
      },

      // Review Administration mappings
      'reviewAdministration.reviewAdministrationAccess.permission': {
        subject: 'ReviewAdmin',
        action: ActionsEnum.READ
      },
      'reviewAdministration.reviewAdministrationAccess.upload.permission': {
        subject: 'Document',
        action: ActionsEnum.UPLOAD,
        conditions: { context: 'reviewAdmin' }
      },
      'reviewAdministration.reviewAdministrationAccess.upload.actions.uploadWorkingCopy': {
        subject: 'Document',
        action: ActionsEnum.UPLOAD,
        conditions: { type: 'workingCopy' }
      },
      'reviewAdministration.reviewAdministrationAccess.upload.actions.uploadReferenceDocument': {
        subject: 'ReferenceDocument',
        action: ActionsEnum.UPLOAD
      },
      'reviewAdministration.reviewManagement': {
        subject: 'Review',
        action: ActionsEnum.MANAGE
      },

      // Admin Document Repository View mappings
      'reviewAdministration.adminDocumentRepositoryView.permission': {
        subject: 'AdminDocumentView',
        action: ActionsEnum.READ
      },
      'reviewAdministration.adminDocumentRepositoryView.pending': {
        subject: 'Document',
        action: ActionsEnum.READ,
        conditions: { status: 'pending' }
      },
      'reviewAdministration.adminDocumentRepositoryView.approved.permission': {
        subject: 'Document',
        action: ActionsEnum.READ,
        conditions: { status: 'approved', context: 'admin' }
      },
      'reviewAdministration.adminDocumentRepositoryView.approved.actions.finalCopy': {
        subject: 'Document',
        action: ActionsEnum.READ,
        conditions: { type: 'finalCopy' }
      },
      'reviewAdministration.adminDocumentRepositoryView.approved.actions.summary': {
        subject: 'DocumentSummary',
        action: ActionsEnum.READ
      },
      'reviewAdministration.adminDocumentRepositoryView.approved.actions.annotatedDocs': {
        subject: 'Document',
        action: ActionsEnum.READ,
        conditions: { type: 'annotated' }
      },
      'reviewAdministration.adminDocumentRepositoryView.deactivated': {
        subject: 'Document',
        action: ActionsEnum.READ,
        conditions: { status: 'deactivated', context: 'admin' }
      },
      'reviewAdministration.adminDocumentRepositoryView.referenceDocuments': {
        subject: 'ReferenceDocument',
        action: ActionsEnum.READ,
        conditions: { context: 'admin' }
      },

      // Generic mappings
      'taskManagement': {
        subject: 'Task',
        action: ActionsEnum.MANAGE
      },
      'userManagement': {
        subject: 'User',
        action: ActionsEnum.MANAGE
      },
      'reportAccess': {
        subject: 'Report',
        action: ActionsEnum.READ
      }
    };
  }

  private inferSubjectFromFieldName(fieldName: string): string {
    // Simple inference logic
    if (fieldName.toLowerCase().includes('document')) return 'Document';
    if (fieldName.toLowerCase().includes('task')) return 'Task';
    if (fieldName.toLowerCase().includes('user')) return 'User';
    if (fieldName.toLowerCase().includes('report')) return 'Report';
    if (fieldName.toLowerCase().includes('notification') || fieldName.toLowerCase().includes('notify')) return 'Notification';
    
    // Default to the field name capitalized
    return fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
  }

  private inferActionFromFieldName(fieldName: string): ActionsEnum {
    // Simple inference logic
    if (fieldName.toLowerCase().includes('manage')) return ActionsEnum.MANAGE;
    if (fieldName.toLowerCase().includes('create')) return ActionsEnum.CREATE;
    if (fieldName.toLowerCase().includes('update')) return ActionsEnum.UPDATE;
    if (fieldName.toLowerCase().includes('delete')) return ActionsEnum.DELETE;
    if (fieldName.toLowerCase().includes('upload')) return ActionsEnum.UPLOAD;
    if (fieldName.toLowerCase().includes('notify')) return ActionsEnum.NOTIFY;
    
    // Default to read
    return ActionsEnum.READ;
  }

  private mergePermissions(permissions: ProcessedPermission[]): ProcessedPermission[] {
    const merged = new Map<string, ProcessedPermission>();

    permissions.forEach(permission => {
      const key = `${permission.subject}-${permission.action}-${JSON.stringify(permission.conditions)}`;
      const existing = merged.get(key);

      if (!existing || this.getAccessLevelPriority(permission.accessLevel) > this.getAccessLevelPriority(existing.accessLevel)) {
        merged.set(key, permission);
      }
    });

    return Array.from(merged.values());
  }

  private getAccessLevelPriority(accessLevel: AccessLevel): number {
    switch (accessLevel) {
      case AccessLevel.NO_ACCESS: return 0;
      case AccessLevel.VIEW_ACCESS: return 1;
      case AccessLevel.WRITE_ACCESS: return 3;
      case AccessLevel.ADMIN_ACCESS: return 4;
      default: return 0;
    }
  }

  private applyPermission(
    can: any,
    cannot: any,
    permission: ProcessedPermission,
    user: UserWithRoles
  ): void {
    const { subject, action, accessLevel, conditions, fields } = permission;
    const processedConditions = this.processConditions(conditions, user);

    switch (accessLevel) {
      case AccessLevel.NO_ACCESS:
        cannot(action, subject, processedConditions);
        break;

      case AccessLevel.VIEW_ACCESS:
        if (fields?.length) {
          can(ActionsEnum.READ, subject, fields, processedConditions);
        } else {
          can(ActionsEnum.READ, subject, processedConditions);
        }
        cannot([ActionsEnum.CREATE, ActionsEnum.UPDATE, ActionsEnum.DELETE], subject, processedConditions);
        break;

      case AccessLevel.WRITE_ACCESS:
        const writeActions = [ActionsEnum.READ, ActionsEnum.CREATE, ActionsEnum.UPDATE];
        if (subject === 'Document') {
          writeActions.push(ActionsEnum.UPLOAD);
        }
        
        if (fields?.length) {
          can(writeActions, subject, fields, processedConditions);
        } else {
          can(writeActions, subject, processedConditions);
        }
        cannot(ActionsEnum.DELETE, subject, processedConditions);
        break;

      case AccessLevel.ADMIN_ACCESS:
        if (fields?.length) {
          can(ActionsEnum.MANAGE, subject, fields, processedConditions);
        } else {
          can(ActionsEnum.MANAGE, subject, processedConditions);
        }
        
       
        if (subject === 'Task') {
          can( subject, processedConditions);
        }
        if (subject === 'Notification') {
          can(ActionsEnum.NOTIFY, subject, processedConditions);
        }
        break;
      default:
        cannot(action, subject, processedConditions);
        break;
    }
  }

  private processConditions(conditions: any, user: UserWithRoles): any {
    if (!conditions) return undefined;

    // Replace template variables
    const conditionsStr = JSON.stringify(conditions)
      .replace(/\{\{userId\}\}/g, user.id)
      .replace(/\{\{userEmail\}\}/g, user.email)
      .replace(/\{\{userDomain\}\}/g, user.domain || '')
      .replace(/\{\{userDepartment\}\}/g, user.department || '');

    return JSON.parse(conditionsStr);
  }
}

export { AppAbility };