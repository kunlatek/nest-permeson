import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type WorkspaceDocument = MongoDBWorkspace & Document;

@Schema({ timestamps: true, collection: 'Workspace' })
export class MongoDBWorkspace extends Document {
  @Prop({ required: true })
  owner: string;

  @Prop({ type: [String] })
  team: string[];
}

export const WorkspaceSchema = SchemaFactory.createForClass(MongoDBWorkspace);