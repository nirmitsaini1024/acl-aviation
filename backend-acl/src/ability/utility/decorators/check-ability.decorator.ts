import { SetMetadata } from '@nestjs/common';
import { ActionsEnum } from 'src/ability/enums/actions.enum';
import { SubjectsType } from 'src/ability/enums/subjects.type';


export interface RequiredRule {
  action: ActionsEnum;
  subject: SubjectsType;
  conditions?: any;
}

export const CHECK_ABILITY_KEY = 'check_ability';

export const CheckAbilities = (...requirements: RequiredRule[]) =>
  SetMetadata(CHECK_ABILITY_KEY, requirements);

// Convenience decorators for common patterns
export const ReadAccess = (subject: SubjectsType, conditions?: any) =>
  CheckAbilities({ action: ActionsEnum.READ, subject, conditions });

export const WriteAccess = (subject: SubjectsType, conditions?: any) =>
  CheckAbilities({ action: ActionsEnum.CREATE, subject, conditions });

export const UpdateAccess = (subject: SubjectsType, conditions?: any) =>
  CheckAbilities({ action: ActionsEnum.UPDATE, subject, conditions });

export const DeleteAccess = (subject: SubjectsType, conditions?: any) =>
  CheckAbilities({ action: ActionsEnum.DELETE, subject, conditions });

export const ManageAccess = (subject: SubjectsType, conditions?: any) =>
  CheckAbilities({ action: ActionsEnum.MANAGE, subject, conditions });
