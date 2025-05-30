import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class UploadActions {
  @Prop({ required: true })
  uploadWorkingCopy: string;

  @Prop({ required: true })
  uploadReferenceDocument: string;
}

export const UploadActionsSchema = SchemaFactory.createForClass(UploadActions);

@Schema()
export class Upload {
  @Prop({ required: true })
  permission: string;

  @Prop({ type: UploadActionsSchema, required: true })
  actions: UploadActions;
}

export const UploadSchema = SchemaFactory.createForClass(Upload);

@Schema()
export class ReviewAdministrationAccess {
  @Prop({ required: true })
  permission: string; // its own top-level permission

  @Prop({ type: UploadSchema, required: true })
  upload: Upload;

  @Prop({ required: true })
  signOff: string;
}

export const ReviewAdministrationAccessSchema = SchemaFactory.createForClass(ReviewAdministrationAccess);

@Schema()
export class ApprovedActions {
  @Prop({ required: true })
  finalCopy: string;

  @Prop({ required: true })
  summary: string;

  @Prop({ required: true })
  annotatedDocs: string;
}

export const ApprovedActionsSchema = SchemaFactory.createForClass(ApprovedActions);

@Schema()
export class Approved {
  @Prop({ required: true })
  permission: string;

  @Prop({ type: ApprovedActionsSchema, required: true })
  actions: ApprovedActions;
}

export const ApprovedSchema = SchemaFactory.createForClass(Approved);

@Schema()
export class AdminDocumentRepositoryView {
  @Prop({ required: true })
  permission: string; // its own top-level permission

  @Prop({ required: true })
  pending: string;

  @Prop({ type: ApprovedSchema, required: true })
  approved: Approved;

  @Prop({ required: true })
  deactivated: string;

  @Prop({ required: true })
  referenceDocuments: string;
}

export const AdminDocumentRepositoryViewSchema = SchemaFactory.createForClass(AdminDocumentRepositoryView);

@Schema()
export class ReviewAdministration extends Document {
  @Prop({ type: ReviewAdministrationAccessSchema, required: true })
  reviewAdministrationAccess: ReviewAdministrationAccess;

  @Prop({ required: true })
  reviewManagement: string;

  @Prop({ type: AdminDocumentRepositoryViewSchema, required: true })
  adminDocumentRepositoryView: AdminDocumentRepositoryView;
}

export const ReviewAdministrationSchema = SchemaFactory.createForClass(ReviewAdministration);