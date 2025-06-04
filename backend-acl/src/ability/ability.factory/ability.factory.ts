// ability/ability.factory.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbilityBuilder, Ability, AbilityClass } from '@casl/ability';
import { ActionsEnum } from '../enums/actions.enum';
import { AccessLevel } from '../enums/access-level.enum';
import { SubjectsType } from '../enums/subjects.type';

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
  taskManagement?: string;
  userManagement?: string;
  reportAccess?: string;
  [key: string]: any;
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

    const userRoles = await this.getUserRoles(user);
    const allPermissions = this.extractPermissionsFromRoles(userRoles, user);

    allPermissions.forEach(permission => {
      this.applyPermission(can, cannot, permission, user);
    });

    return build({
      detectSubjectType: (item: any) =>
        item?.__caslSubjectType__ ?? item?.constructor?.name,
    });
  }

  async getUserAbilitiesSummary(user: UserWithRoles): Promise<any> {
    const roles = await this.getUserRoles(user);
    
    if (!roles || roles.length === 0) {
      return this.getDefaultPermissions();
    }

    // Merge all role permissions
    const mergedPermissions = this.mergeAllRolePermissions(roles);
    
    return {
      totalRoles: roles.length,
      roles: roles.map(role => ({
        id: role._id?.toString(),
        name: role.roleName,
        title: role.roleTitle,
        domain: role.domain,
        department: role.department
      })),
      permissions: mergedPermissions
    };
  }

  public async getUserRoles(user: UserWithRoles): Promise<BaseRole[]> {
    const roles: BaseRole[] = [];

    if (user.roleIds?.length) {
      const userRoles = await this.roleModel.find({
        _id: { $in: user.roleIds }
      }).lean().exec();
      roles.push(...userRoles);
    }

    if (user.groupIds?.length) {
      const userGroups = await this.groupModel.find({
        _id: { $in: user.groupIds }
      }).lean().exec();

      for (const group of userGroups) {
        if (group.roleIds?.length) {
          const groupRoles = await this.roleModel.find({
            _id: { $in: group.roleIds }
          }).lean().exec();
          roles.push(...groupRoles);
        }
      }
    }

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
    return false; // Keep existing for now
  }

  private mergeAllRolePermissions(roles: BaseRole[]): any {
    // Start with default (no access) structure
    const merged = this.getDefaultPermissions().permissions;

    roles.forEach(role => {
      // Merge documentRepoAccess
      if (role.documentRepoAccess) {
        this.mergeDocumentRepoAccess(merged.documentRepoAccess, role.documentRepoAccess);
      }

      // Merge reviewAdministration
      if (role.reviewAdministration) {
        this.mergeReviewAdministration(merged.reviewAdministration, role.reviewAdministration);
      }

      // Merge simple fields
      if (role.taskManagement) {
        merged.taskManagement = this.getHigherAccessLevel(merged.taskManagement, role.taskManagement);
      }
      if (role.userManagement) {
        merged.userManagement = this.getHigherAccessLevel(merged.userManagement, role.userManagement);
      }
      if (role.reportAccess) {
        merged.reportAccess = this.getHigherAccessLevel(merged.reportAccess, role.reportAccess);
      }
    });

    return merged;
  }

  private mergeDocumentRepoAccess(target: any, source: any): void {
    if (source.inReview) {
      if (source.inReview.permission) {
        target.inReview.permission = this.getHigherAccessLevel(target.inReview.permission, source.inReview.permission);
      }
      if (source.inReview.actions) {
        if (source.inReview.actions.referenceDocumentAccess) {
          target.inReview.actions.referenceDocumentAccess = this.getHigherAccessLevel(
            target.inReview.actions.referenceDocumentAccess,
            source.inReview.actions.referenceDocumentAccess
          );
        }
        if (source.inReview.actions.notify) {
          target.inReview.actions.notify = this.getHigherAccessLevel(
            target.inReview.actions.notify,
            source.inReview.actions.notify
          );
        }
      }
    }

    if (source.referenceDocument) {
      target.referenceDocument = this.getHigherAccessLevel(target.referenceDocument, source.referenceDocument);
    }
    if (source.approved) {
      target.approved = this.getHigherAccessLevel(target.approved, source.approved);
    }
    if (source.deactivated) {
      target.deactivated = this.getHigherAccessLevel(target.deactivated, source.deactivated);
    }
  }

  private mergeReviewAdministration(target: any, source: any): void {
    if (source.reviewAdministrationAccess) {
      if (source.reviewAdministrationAccess.permission) {
        target.reviewAdministrationAccess.permission = this.getHigherAccessLevel(
          target.reviewAdministrationAccess.permission,
          source.reviewAdministrationAccess.permission
        );
      }
      if (source.reviewAdministrationAccess.upload) {
        if (source.reviewAdministrationAccess.upload.permission) {
          target.reviewAdministrationAccess.upload.permission = this.getHigherAccessLevel(
            target.reviewAdministrationAccess.upload.permission,
            source.reviewAdministrationAccess.upload.permission
          );
        }
        if (source.reviewAdministrationAccess.upload.actions) {
          if (source.reviewAdministrationAccess.upload.actions.uploadWorkingCopy) {
            target.reviewAdministrationAccess.upload.actions.uploadWorkingCopy = this.getHigherAccessLevel(
              target.reviewAdministrationAccess.upload.actions.uploadWorkingCopy,
              source.reviewAdministrationAccess.upload.actions.uploadWorkingCopy
            );
          }
          if (source.reviewAdministrationAccess.upload.actions.uploadReferenceDocument) {
            target.reviewAdministrationAccess.upload.actions.uploadReferenceDocument = this.getHigherAccessLevel(
              target.reviewAdministrationAccess.upload.actions.uploadReferenceDocument,
              source.reviewAdministrationAccess.upload.actions.uploadReferenceDocument
            );
          }
        }
      }
    }

    if (source.reviewManagement) {
      target.reviewManagement = this.getHigherAccessLevel(target.reviewManagement, source.reviewManagement);
    }

    if (source.adminDocumentRepositoryView) {
      if (source.adminDocumentRepositoryView.permission) {
        target.adminDocumentRepositoryView.permission = this.getHigherAccessLevel(
          target.adminDocumentRepositoryView.permission,
          source.adminDocumentRepositoryView.permission
        );
      }
      if (source.adminDocumentRepositoryView.pending) {
        target.adminDocumentRepositoryView.pending = this.getHigherAccessLevel(
          target.adminDocumentRepositoryView.pending,
          source.adminDocumentRepositoryView.pending
        );
      }
      if (source.adminDocumentRepositoryView.approved) {
        if (source.adminDocumentRepositoryView.approved.permission) {
          target.adminDocumentRepositoryView.approved.permission = this.getHigherAccessLevel(
            target.adminDocumentRepositoryView.approved.permission,
            source.adminDocumentRepositoryView.approved.permission
          );
        }
        if (source.adminDocumentRepositoryView.approved.actions) {
          const sourceActions = source.adminDocumentRepositoryView.approved.actions;
          const targetActions = target.adminDocumentRepositoryView.approved.actions;
          
          if (sourceActions.finalCopy) {
            targetActions.finalCopy = this.getHigherAccessLevel(targetActions.finalCopy, sourceActions.finalCopy);
          }
          if (sourceActions.summary) {
            targetActions.summary = this.getHigherAccessLevel(targetActions.summary, sourceActions.summary);
          }
          if (sourceActions.annotatedDocs) {
            targetActions.annotatedDocs = this.getHigherAccessLevel(targetActions.annotatedDocs, sourceActions.annotatedDocs);
          }
        }
      }
      if (source.adminDocumentRepositoryView.deactivated) {
        target.adminDocumentRepositoryView.deactivated = this.getHigherAccessLevel(
          target.adminDocumentRepositoryView.deactivated,
          source.adminDocumentRepositoryView.deactivated
        );
      }
      if (source.adminDocumentRepositoryView.referenceDocuments) {
        target.adminDocumentRepositoryView.referenceDocuments = this.getHigherAccessLevel(
          target.adminDocumentRepositoryView.referenceDocuments,
          source.adminDocumentRepositoryView.referenceDocuments
        );
      }
    }
  }

  private getHigherAccessLevel(current: string, incoming: string): string {
    const levels = {
      'no_access': 0,
      'view_access': 1,
      'write_access': 2,
      'admin_access': 3
    };

    const currentLevel = levels[current] || 0;
    const incomingLevel = levels[incoming] || 0;

    return incomingLevel > currentLevel ? incoming : current;
  }

  private getDefaultPermissions(): any {
    return {
      totalRoles: 0,
      roles: [],
      permissions: {
        documentRepoAccess: {
          inReview: {
            permission: "no_access",
            actions: {
              referenceDocumentAccess: "no_access",
              notify: "no_access"
            }
          },
          referenceDocument: "view_access", // Default read access to reference docs
          approved: "view_access", // Default read access to approved docs
          deactivated: "no_access"
        },
        reviewAdministration: {
          reviewAdministrationAccess: {
            permission: "no_access",
            upload: {
              permission: "no_access",
              actions: {
                uploadWorkingCopy: "no_access",
                uploadReferenceDocument: "no_access"
              }
            }
          },
          reviewManagement: "no_access",
          adminDocumentRepositoryView: {
            permission: "no_access",
            pending: "no_access",
            approved: {
              permission: "no_access",
              actions: {
                finalCopy: "no_access",
                summary: "no_access",
                annotatedDocs: "no_access"
              }
            },
            deactivated: "no_access",
            referenceDocuments: "no_access"
          }
        },
        taskManagement: "no_access",
        userManagement: "no_access",
        reportAccess: "no_access"
      }
    };
  }

  private extractPermissionsFromRoles(roles: BaseRole[], user: UserWithRoles): ProcessedPermission[] {
    const permissions: ProcessedPermission[] = [];

    roles.forEach(role => {
      Object.keys(role).forEach(key => {
        if (this.isAccessLevelField(role[key])) {
          const permission = this.convertToPermission(key, role[key], role, user);
          if (permission) {
            permissions.push(permission);
          }
        } else if (this.isNestedPermissionsObject(role[key])) {
          const nestedPermissions = this.extractNestedPermissions(key, role[key], role, user);
          permissions.push(...nestedPermissions);
        }
      });
    });

    return this.mergePermissions(permissions);
  }

  private isAccessLevelField(value: any): boolean {
    return typeof value === 'string' && ['no_access', 'view_access', 'write_access', 'admin_access'].includes(value);
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
    const fieldMapping = this.getFieldMapping();
    const mapping = fieldMapping[fieldName];

    if (!mapping) {
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
        const fullKey = `${parentKey}.${key}`;
        const permission = this.convertToPermission(fullKey, value, role, user);
        if (permission) {
          permissions.push(permission);
        }
      } else if (typeof value === 'object' && value !== null) {
        if (value.permission && this.isAccessLevelField(value.permission)) {
          const fullKey = `${parentKey}.${key}.permission`;
          const permission = this.convertToPermission(fullKey, value.permission, role, user);
          if (permission) {
            permissions.push(permission);
          }
        }
        
        if (value.actions && typeof value.actions === 'object') {
          const actionsPermissions = this.extractNestedPermissions(
            `${parentKey}.${key}.actions`,
            value.actions,
            role,
            user
          );
          permissions.push(...actionsPermissions);
        }
        
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

  private getFieldMapping(): Record<string, any> {
    return {
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
    if (fieldName.toLowerCase().includes('document')) return 'Document';
    if (fieldName.toLowerCase().includes('task')) return 'Task';
    if (fieldName.toLowerCase().includes('user')) return 'User';
    if (fieldName.toLowerCase().includes('report')) return 'Report';
    if (fieldName.toLowerCase().includes('notification') || fieldName.toLowerCase().includes('notify')) return 'Notification';
    
    return fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
  }

  private inferActionFromFieldName(fieldName: string): ActionsEnum {
    if (fieldName.toLowerCase().includes('manage')) return ActionsEnum.MANAGE;
    if (fieldName.toLowerCase().includes('create')) return ActionsEnum.CREATE;
    if (fieldName.toLowerCase().includes('update')) return ActionsEnum.UPDATE;
    if (fieldName.toLowerCase().includes('delete')) return ActionsEnum.DELETE;
    if (fieldName.toLowerCase().includes('upload')) return ActionsEnum.UPLOAD;
    if (fieldName.toLowerCase().includes('notify')) return ActionsEnum.NOTIFY;
    
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
        
        if (subject === 'Document') {
          can( subject, processedConditions);
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

    const conditionsStr = JSON.stringify(conditions)
      .replace(/\{\{userId\}\}/g, user.id)
      .replace(/\{\{userEmail\}\}/g, user.email)
      .replace(/\{\{userDomain\}\}/g, user.domain || '')
      .replace(/\{\{userDepartment\}\}/g, user.department || '');

    return JSON.parse(conditionsStr);
  }
}

export { AppAbility };