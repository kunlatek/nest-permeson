import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InvitationDocument = MongoDBInvitation & Document;

@Schema({ timestamps: true, collection: 'Invitation' })
export class MongoDBInvitation extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true, default: false })
  accepted: boolean;

  @Prop({ required: false })
  workspaceId: string;

  @Prop({ required: false })
  createdBy: string;
}

export const InvitationSchema = SchemaFactory.createForClass(MongoDBInvitation);

