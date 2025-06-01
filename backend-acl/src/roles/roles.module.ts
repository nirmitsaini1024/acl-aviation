import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RoleSchema } from './schemas/role.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleService } from './roles.service';
import { UserSchema } from '../users/schemas/users.schema';
import { GroupSchema } from '../groups/schemas/groups.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Role', schema: RoleSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Group', schema: GroupSchema }
    ]),
    AuthModule
  ],
  controllers: [RolesController],
  providers: [RoleService]
})
export class RolesModule {}
