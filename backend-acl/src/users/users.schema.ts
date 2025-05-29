import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  domain: string;

  @Prop({ required: true })
  department: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  middlename: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  jobTitle: string;

  @Prop({ enum: ['12 hours', '1 day', '3 days','Weekly','Monthly'], required: true })
  reminder: string;
}

export const UserSchema = SchemaFactory.createForClass(User);