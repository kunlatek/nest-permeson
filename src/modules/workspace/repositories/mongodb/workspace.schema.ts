import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { ACL } from "../../models";

export type WorkspaceDocument = MongoDBWorkspace & Document;

@Schema({ timestamps: true })
export class MongoDBWorkspace extends Document {
  @Prop({ required: true })
  owner: string;

  @Prop({ type: [String] })
  team: string[];

  @Prop({ type: [Object] })
  acl: ACL[];
}

export const WorkspaceSchema = SchemaFactory.createForClass(MongoDBWorkspace);