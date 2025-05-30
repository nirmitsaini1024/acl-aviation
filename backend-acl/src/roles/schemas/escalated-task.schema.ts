import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class EscalatedTaskAccess extends Document {
  @Prop({ required: true })
  notify: string;

  @Prop({ required: true })
  assign: string;

  @Prop({ required: true })
  escalatedTaskAccess: string;

}

export const EscalatedTaskAccessSchema = SchemaFactory.createForClass(EscalatedTaskAccess);
