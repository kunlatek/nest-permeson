import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = MongoDBPost & Document;

@Schema({ timestamps: true, collection: 'Post' })
export class MongoDBPost extends Document {
  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true })
  conteudo: string;

  @Prop({ required: true, type: Date })
  dataPublicacao: Date;

  @Prop({ required: true, type: Number })
  tempoLeitura: number;

  @Prop({ required: true })
  autor: string;

  @Prop({ required: true })
  workspace: string;

  @Prop({ required: true })
  createdBy: string;

  @Prop({ required: true })
  ownerId: string;
}

export const PostSchema = SchemaFactory.createForClass(MongoDBPost);
