import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { GenderEnum, MaritalStatusEnum, EducationLevelEnum } from '../../enums';
import { PersonJob, PersonEducation, PersonCourse, PersonBankData, PersonRelatedFile } from '../../models';

export type PersonProfileDocument = MongoDBPersonProfile & Document;

@Schema({ timestamps: true, collection: 'PersonProfile' })
export class MongoDBPersonProfile extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ type: String, required: true })
  userName: string;

  @Prop()
  personName: string;

  @Prop()
  personNickname?: string;

  @Prop({ enum: GenderEnum })
  gender: GenderEnum;

  @Prop({ type: Date })
  birthday: Date;

  @Prop({ enum: MaritalStatusEnum })
  maritalStatus?: MaritalStatusEnum;

  @Prop()
  motherName?: string;

  @Prop()
  fatherName?: string;

  @Prop({ type: [String] })
  tagId: string[];

  @Prop()
  personDescription?: string;

  // 🔹 Documentos
  @Prop()
  cpf?: string;

  @Prop()
  cpfFile?: string;

  @Prop()
  rg?: string;

  @Prop()
  rgIssuingAuthority?: string;

  @Prop({ type: Date })
  rgIssuanceDate?: Date;

  @Prop()
  rgState?: string;

  @Prop()
  rgFile?: string;

  @Prop()
  passport?: string;

  @Prop({ type: Date })
  passportIssuanceDate?: Date;

  @Prop({ type: Date })
  passportExpirationDate?: Date;

  @Prop()
  passportFile?: string;

  // 🔹 Contatos
  @Prop()
  phoneNumberOne?: string;

  @Prop()
  phoneNumberTwo?: string;

  @Prop()
  emailOne?: string;

  @Prop()
  emailTwo?: string;

  @Prop()
  linkedin?: string;

  @Prop()
  instagram?: string;

  @Prop()
  facebook?: string;

  @Prop()
  x?: string;

  // 🔹 Endereços
  @Prop()
  addressOneCepBrasilApi?: string;

  @Prop()
  addressOneType?: string;

  @Prop()
  addressOneStreet?: string;

  @Prop()
  addressOneNumber?: string;

  @Prop()
  addressOneComplement?: string;

  @Prop()
  addressOneCity?: string;

  @Prop()
  addressOneState?: string;

  @Prop()
  addressTwoCepBrasilApi?: string;

  @Prop()
  addressTwoType?: string;

  @Prop()
  addressTwoStreet?: string;

  @Prop()
  addressTwoNumber?: string;

  @Prop()
  addressTwoComplement?: string;

  @Prop()
  addressTwoCity?: string;

  @Prop()
  addressTwoState?: string;

  // 🔹 Profissões
  @Prop({ type: [Object] })
  professions?: PersonJob[];

  // 🔹 Educação
  @Prop({ enum: EducationLevelEnum })
  personEducation?: EducationLevelEnum;

  @Prop({ type: [Object] })
  personEducations?: PersonEducation[];

  @Prop({ type: [Object] })
  personCourses?: PersonCourse[];

  @Prop({ type: [String] })
  personLanguages?: string[];

  // 🔹 Banco
  @Prop({ type: Object })
  bankDataOne?: PersonBankData;

  @Prop({ type: Object })
  bankDataTwo?: PersonBankData;

  // 🔹 Arquivos relacionados
  @Prop({ type: [Object] })
  relatedFiles?: PersonRelatedFile[];

  @Prop({ required: true })
  createdBy: string;

  @Prop({ required: true })
  ownerId: string;
}

export const PersonProfileSchema = SchemaFactory.createForClass(MongoDBPersonProfile);
