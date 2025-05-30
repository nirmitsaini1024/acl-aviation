import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Role extends Document {
  @Prop({ required: true })
  domain: string;

  @Prop({ required: true })
  department: string;

  @Prop({ required: true })
  roleName: string;

  @Prop()
  middlename?: string;  //optional

  @Prop({ required: true })
  roleTitle: string;

  @Prop({ required: true })
  description: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
