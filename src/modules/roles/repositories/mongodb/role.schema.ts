import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoleDocument = MongoDBRole & Document & {
  createdAt?: Date;
  updatedAt?: Date;
};

@Schema({ timestamps: true, collection: 'Role' })
export class MongoDBRole extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [Object], required: true })
  permissions: { module: string; actionList: string[] }[];

  @Prop({ required: true })
  workspace: string;

  @Prop({ required: true })
  createdBy: string;
}

export const RoleSchema = SchemaFactory.createForClass(MongoDBRole);

