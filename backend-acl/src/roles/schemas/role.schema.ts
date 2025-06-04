import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { DocumentRepoAccess, DocumentRepoAccessSchema } from './document-repo.schema';
import { ReviewAdministration, ReviewAdministrationSchema } from './review-administration.schema';
import { TaskAccess, TaskAccessSchema } from './task.schema';
import { EscalatedTaskAccess, EscalatedTaskAccessSchema } from './escalated-task.schema';

@Schema()
export class Role extends Document {
  @Prop({ required: true })
  domain: string;

  @Prop({ required: true })
  department: string;

  @Prop({ required: true })
  roleName: string;

  @Prop()
  middlename?: string;

  @Prop({ required: true })
  roleTitle: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }], default: [] })
  userIds: MongooseSchema.Types.ObjectId[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Group' }], default: [] })
  groupIds: MongooseSchema.Types.ObjectId[];


  @Prop({ type: DocumentRepoAccessSchema, required: true })
  documentRepoAccess: DocumentRepoAccess;

  @Prop({ type: ReviewAdministrationSchema, required: true })
  reviewAdministration: ReviewAdministration;

  @Prop({ type: TaskAccessSchema, required: true })
  taskAccess: TaskAccess;

  @Prop({ type: EscalatedTaskAccessSchema, required: true })
  escalatedTaskAccess: EscalatedTaskAccess;

}

export const RoleSchema = SchemaFactory.createForClass(Role);
