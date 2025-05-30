import { Module } from '@nestjs/common';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupSchema } from './schemas/groups.schema';

@Module({
  imports : [ MongooseModule.forFeature([{ name: 'Group', schema: GroupSchema }]),],
  controllers: [GroupsController],
  providers: [GroupsService]
})
export class GroupsModule {}
