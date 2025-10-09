import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = MongoDBPost & Document;

@Schema({ timestamps: true, collection: 'Post' })
export class MongoDBPost extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, type: Date })
  publishedAt: Date;

  @Prop({ required: true, type: Number })
  readingTime: number;

  @Prop({ required: true })
  author: string;

  @Prop({ required: true })
  workspace: string;

  @Prop({ required: true })
  createdBy: string;

  @Prop({ type: [Object], required: false })
  cover?: { name: string; url: string }[];

  @Prop({ type: [String], required: false })
  tags?: string[];

  @Prop({ type: [Object], required: false })
  coauthors?: { name: string; subject: string; link?: string; phone?: string }[];

  @Prop({ type: [String], required: false })
  relatedPosts?: string[];
}

export const PostSchema = SchemaFactory.createForClass(MongoDBPost);
