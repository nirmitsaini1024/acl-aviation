import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AccessLevel } from 'src/ability/enums/access-level.enum'; 

@Schema()
export class GroupActions {
  @Prop({ enum: Object.values(AccessLevel), required: true })
  review: AccessLevel;

  @Prop({ enum: Object.values(AccessLevel), required: true })
  approval: AccessLevel;
}

export const GroupActionsSchema = SchemaFactory.createForClass(GroupActions);

@Schema()
export class GroupAccess {
  @Prop({ enum: Object.values(AccessLevel), required: true })
  permission: AccessLevel;

  @Prop({ type: GroupActionsSchema, required: true })
  actions: GroupActions;
}

export const GroupAccessSchema = SchemaFactory.createForClass(GroupAccess);

@Schema()
export class TaskAccess extends Document {
  @Prop({ type: GroupAccessSchema, required: true })
  group: GroupAccess;

  @Prop({enum: Object.values(AccessLevel), required: true })
  user: AccessLevel;
}

export const TaskAccessSchema = SchemaFactory.createForClass(TaskAccess);
