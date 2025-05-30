import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RoleSchema } from './schemas/role.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleService } from './roles.service';

@Module({
  imports : [ MongooseModule.forFeature([{ name: 'Role', schema: RoleSchema }]),],
  controllers: [RolesController],
  providers: [RoleService]
})
export class RolesModule {}
