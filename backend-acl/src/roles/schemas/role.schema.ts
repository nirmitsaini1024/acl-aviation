import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { DocumentRepoAccess, DocumentRepoAccessSchema } from './document-repo.schema';

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

  @Prop({ type: DocumentRepoAccessSchema, required: true })
  documentRepoAccess: DocumentRepoAccess;

  // @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ReviewAdministration', required: true })
  // reviewAdministration: MongooseSchema.Types.ObjectId;

  // @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'TaskAccess', required: true })
  // taskAccess: MongooseSchema.Types.ObjectId;

  // @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'EscalatedTaskAccess', required: true })
  // escalatedTaskAccess: MongooseSchema.Types.ObjectId;
  
}

export const RoleSchema = SchemaFactory.createForClass(Role);
