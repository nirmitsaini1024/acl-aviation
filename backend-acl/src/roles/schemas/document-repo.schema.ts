import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Actions {
  @Prop({ required: true })
  referenceDocumentAccess: string;

  @Prop({ required: true })
  notify: string;
}

export const ActionsSchema = SchemaFactory.createForClass(Actions);

@Schema()
export class InReview {
  @Prop({ required: true })
  permission: string;

  @Prop({ type: ActionsSchema, required: true })
  actions: Actions;
}

export const InReviewSchema = SchemaFactory.createForClass(InReview);

@Schema()
export class DocumentRepoAccess {
  @Prop({ type: InReviewSchema, required: true })
  inReview: InReview;

  @Prop({ required: true })
  referenceDocument: string;

  @Prop({ required: true })
  approved: string;

  @Prop({ required: true })
  deactivated: string;
}

export const DocumentRepoAccessSchema = SchemaFactory.createForClass(DocumentRepoAccess);
