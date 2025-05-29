import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Role {
  @Prop({ required: true })
  domain: string;

  @Prop({ required: true })
  department: string;

  @Prop({ required: true })
  roleName: string;

  @Prop({ required: false })
  middlename: string;

  @Prop({ required: true })
  roleTitle: string;

  @Prop({ required: true })
  description: string;

}

export const RoleSchema = SchemaFactory.createForClass(Role);