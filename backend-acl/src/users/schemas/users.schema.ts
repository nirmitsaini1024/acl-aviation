import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  domain: string;

  @Prop({ required: true })
  department: string;

  @Prop({ required: true })
  firstName: string;

  @Prop()
  middlename?: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  jobTitle: string;

  @Prop({ enum: ['12 hours', '1 day', '3 days', '7 days'], required: true })
  reminder: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Role' }], default : [], required: true })
  roles: MongooseSchema.Types.ObjectId[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Group' }], default: [], required: true })
  groups: MongooseSchema.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
