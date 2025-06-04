import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AccessLevel } from 'src/ability/enums/access-level.enum';

@Schema()
export class UploadActions {
  @Prop({ enum: Object.values(AccessLevel),required: true })
  uploadWorkingCopy: AccessLevel;

  @Prop({enum: Object.values(AccessLevel) , required: true })
  uploadReferenceDocument: AccessLevel;
}

export const UploadActionsSchema = SchemaFactory.createForClass(UploadActions);

@Schema()
export class Upload {
  @Prop({enum: Object.values(AccessLevel) , required: true })
  permission: AccessLevel;

  @Prop({ type: UploadActionsSchema, required: true })
  actions: UploadActions;
}

export const UploadSchema = SchemaFactory.createForClass(Upload);

@Schema()
export class ReviewAdministrationAccess {
  @Prop({ enum: Object.values(AccessLevel), required: true })
  permission: AccessLevel; // its own top-level permission

  @Prop({ type: UploadSchema, required: true })
  upload: Upload;

  @Prop({ enum: Object.values(AccessLevel) ,  required: true })
  signOff: AccessLevel;
}

export const ReviewAdministrationAccessSchema = SchemaFactory.createForClass(ReviewAdministrationAccess);

@Schema()
export class ApprovedActions {
  @Prop({ enum: Object.values(AccessLevel), required: true })
  finalCopy: AccessLevel;

  @Prop({enum: Object.values(AccessLevel), required: true })
  summary: AccessLevel;

  @Prop({ enum: Object.values(AccessLevel), required: true })
  annotatedDocs: AccessLevel;
}

export const ApprovedActionsSchema = SchemaFactory.createForClass(ApprovedActions);

@Schema()
export class Approved {
  @Prop({ enum: Object.values(AccessLevel), required: true })
  permission: AccessLevel;

  @Prop({ type: ApprovedActionsSchema, required: true })
  actions: ApprovedActions;
}

export const ApprovedSchema = SchemaFactory.createForClass(Approved);

@Schema()
export class AdminDocumentRepositoryView {
  @Prop({ enum: Object.values(AccessLevel), required: true })
  permission: AccessLevel; // its own top-level permission

  @Prop({ enum: Object.values(AccessLevel), required: true })
  pending: AccessLevel;

  @Prop({  type: ApprovedSchema, required: true })
  approved: Approved;

  @Prop({enum: Object.values(AccessLevel), required: true })
  deactivated: AccessLevel;

  @Prop({ enum: Object.values(AccessLevel), required: true })
  referenceDocuments: AccessLevel;
}

export const AdminDocumentRepositoryViewSchema = SchemaFactory.createForClass(AdminDocumentRepositoryView);

@Schema()
export class ReviewAdministration extends Document {
  @Prop({ type: ReviewAdministrationAccessSchema, required: true })
  reviewAdministrationAccess: ReviewAdministrationAccess;

  @Prop({ enum: Object.values(AccessLevel), required: true })
  reviewManagement: AccessLevel;

  @Prop({ type: AdminDocumentRepositoryViewSchema, required: true })
  adminDocumentRepositoryView: AdminDocumentRepositoryView;
}

export const ReviewAdministrationSchema = SchemaFactory.createForClass(ReviewAdministration);