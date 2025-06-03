import { forwardRef, Module } from '@nestjs/common';
import { AbilityFactory } from './ability.factory/ability.factory';
import { CaslAbilityGuard } from './casl-ability/casl-ability.guard';
import { RoleService } from 'src/roles/roles.service';
import { RolesModule } from 'src/roles/roles.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports : [
    forwardRef(() => RolesModule),
    forwardRef(() => AuthModule),  ],
  providers: [AbilityFactory, CaslAbilityGuard, RoleService],
  exports: [AbilityFactory, CaslAbilityGuard,AbilityFactory],
})
export class CaslAbilityModule {}