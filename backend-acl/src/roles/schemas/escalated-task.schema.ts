import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AccessLevel } from 'src/ability/enums/access-level.enum'; 

@Schema()
export class EscalatedTaskAccess extends Document {
  @Prop({ enum: Object.values(AccessLevel), required: true })
  notify: AccessLevel;

  @Prop({ enum: Object.values(AccessLevel), required: true })
  assign: AccessLevel;

  @Prop({ enum: Object.values(AccessLevel), required: true })
  escalatedTaskAccess: AccessLevel;
}

export const EscalatedTaskAccessSchema = SchemaFactory.createForClass(EscalatedTaskAccess);
