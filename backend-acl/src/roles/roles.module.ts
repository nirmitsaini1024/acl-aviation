import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { RoleSchema } from './schemas/role.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports : [ MongooseModule.forFeature([{ name: 'Role', schema: RoleSchema }]),],
  controllers: [RolesController],
  providers: [RolesService]
})
export class RolesModule {}
