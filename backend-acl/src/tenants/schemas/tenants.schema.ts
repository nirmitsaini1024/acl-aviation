import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Tenant extends Document {

  @Prop({ required: true })
  tenantName : string;

  @Prop({ required: true })
  userName: string;

  @Prop()
  mobileNumber ?: string; 

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  users: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Group' }], default: [] })
  groups: Types.ObjectId[];

}

export const TenantSchema = SchemaFactory.createForClass(Tenant);
