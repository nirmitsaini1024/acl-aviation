import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Tenant extends Document {
  @Prop({ required: true })
  tenantId: string;

  @Prop({ required: true })
  tenantName : string;

  @Prop({ required: true })
  userName: string;

  @Prop()
  mobileNumber ?: string; 

}

export const TenantSchema = SchemaFactory.createForClass(Tenant);
