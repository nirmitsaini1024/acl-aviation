import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AppAbility } from './ability.factory/ability.factory';

export const GetAbility = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AppAbility => {
    const request = ctx.switchToHttp().getRequest();
    return request.ability;
  },
);