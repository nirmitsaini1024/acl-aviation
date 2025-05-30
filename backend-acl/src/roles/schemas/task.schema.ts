import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class GroupActions {
  @Prop({ required: true })
  review: string;

  @Prop({ required: true })
  approval: string;
}

export const GroupActionsSchema = SchemaFactory.createForClass(GroupActions);

@Schema()
export class GroupAccess {
  @Prop({ required: true })
  permission: string;

  @Prop({ type: GroupActionsSchema, required: true })
  actions: GroupActions;
}

export const GroupAccessSchema = SchemaFactory.createForClass(GroupAccess);

@Schema()
export class TaskAccess extends Document {
  @Prop({ type: GroupAccessSchema, required: true })
  group: GroupAccess;

  @Prop({ required: true })
  user: string;
}

export const TaskAccessSchema = SchemaFactory.createForClass(TaskAccess);
