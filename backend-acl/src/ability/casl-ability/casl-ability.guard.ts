import { 
  Injectable, 
  CanActivate, 
  ExecutionContext, 
  ForbiddenException 
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactory } from '../ability.factory/ability.factory';
import { CHECK_ABILITY_KEY, RequiredRule } from '../utility/decorators/check-ability.decorator';
import { User_ } from 'src/types/user.interface';
import { User } from 'src/users/schemas/users.schema';



@Injectable()
export class CaslAbilityGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: AbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rules = this.reflector.get<RequiredRule[]>(
      CHECK_ABILITY_KEY,
      context.getHandler(),
    ) || [];

    if (!rules.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    try {
      const ability = await this.abilityFactory.createForUser(user.id);
      
      return rules.every((rule) => {
        const { action, subject, conditions } = rule;
        const finalConditions = this.processConditions(conditions, user.id, request);
        
        return ability.can(action, subject, finalConditions);
      });
    } catch (error) {
      throw new ForbiddenException('Access denied');
    }
  }

  private processConditions(
    conditions: any,
    user: User_,
    request: any,
  ): any {
    if (!conditions) return undefined;

    // Process template variables like {{userId}}
    const processedConditions = JSON.parse(
      JSON.stringify(conditions).replace(/\{\{userId\}\}/g, user._id)
    );

    return processedConditions;
  }
}