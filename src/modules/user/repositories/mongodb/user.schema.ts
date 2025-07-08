import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = MongoDBUser & Document;

@Schema({ timestamps: true })
export class MongoDBUser extends Document {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ type: Date, default: null }) // Campo para soft delete
    deletedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(MongoDBUser); 