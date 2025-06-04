import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AccessLevel } from 'src/ability/enums/access-level.enum'; 

@Schema()
export class Actions {
  @Prop({ enum: Object.values(AccessLevel), required: true })
  referenceDocumentAccess: AccessLevel;

  @Prop({ enum: Object.values(AccessLevel), required: true })
  notify: AccessLevel;
}

export const ActionsSchema = SchemaFactory.createForClass(Actions);

@Schema()
export class InReview {
  @Prop({ enum: Object.values(AccessLevel), required: true })
  permission: AccessLevel;

  @Prop({ type: ActionsSchema, required: true })
  actions: Actions;
}

export const InReviewSchema = SchemaFactory.createForClass(InReview);

@Schema()
export class DocumentRepoAccess {
  @Prop({ type: InReviewSchema, required: true })
  inReview: InReview;

  @Prop({ enum: Object.values(AccessLevel), required: true })
  referenceDocument: AccessLevel;

  @Prop({ enum: Object.values(AccessLevel), required: true })
  approved: AccessLevel;

  @Prop({ enum: Object.values(AccessLevel), required: true })
  deactivated: AccessLevel;
}

export const DocumentRepoAccessSchema = SchemaFactory.createForClass(DocumentRepoAccess);
