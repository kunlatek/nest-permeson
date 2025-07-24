import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ContactType } from '../../enums/contact-type.enum';
import { BankAccountTypeEnum } from '../../enums/bank-account-type.enum';
import { AddressType } from '../../enums/address-type.enum';


export type CompanyProfileDocument = MongoDBCompanyProfile & Document;

@Schema({ timestamps: true })
export class MongoDBCompanyProfile extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ type: String, required: true })
  userName: string;

  @Prop()
  cnpj?: string;

  @Prop()
  companyName: string;

  @Prop()
  businessName: string;

  @Prop()
  birthday?: Date;

  @Prop()
  legalNature?: string;

  @Prop()
  companyDescription?: string;

  @Prop()
  logoImage?: string;

  @Prop([String])
  companyImages?: string[];

  @Prop({ type: [String] })
  tagId?: string[];

  @Prop([
    {
      personId: String,
    },
  ])
  partners?: { personId: string }[];

  @Prop([
    {
      contactType: { type: String, enum: Object.values(ContactType) },
      contactValue: { type: String },
      contactComplement: { type: String },
    },
  ])
  contacts?: {
    contactType: ContactType;
    contactValue: string;
    contactComplement: string;
  }[];

  // Endereço 1
  @Prop()
  addressOneCepBrasilApi?: string;

  @Prop({ enum: Object.values(AddressType) })
  addressOneType?: AddressType;

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

  // Endereço 2
  @Prop()
  addressTwoCepBrasilApi?: string;

  @Prop({ enum: Object.values(AddressType) })
  addressTwoType?: AddressType;

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

  // Banco 1
  @Prop({
    type: {
      bankName: String,
      bankBranch: String,
      bankAccount: String,
      bankAccountType: { type: String, enum: Object.values(BankAccountTypeEnum) },
    },
  })
  bankDataOne?: {
    bankName?: string;
    bankBranch?: string;
    bankAccount?: string;
    bankAccountType?: BankAccountTypeEnum;
  };

  // Banco 2
  @Prop({
    type: {
      bankName: String,
      bankBranch: String,
      bankAccount: String,
      bankAccountType: { type: String, enum: Object.values(BankAccountTypeEnum) },
    },
  })
  bankDataTwo?: {
    bankName?: string;
    bankBranch?: string;
    bankAccount?: string;
    bankAccountType?: BankAccountTypeEnum;
  };

  @Prop([
    {
      filesDescription: { type: String, required: true },
      relatedFilesFiles: { type: String, required: true },
      relatedFilesDateDay: { type: Number, required: true },
      relatedFilesDateMonth: { type: Number, required: true },
      relatedFilesDateYear: { type: Number, required: true },
    },
  ])
  relatedFiles?: {
    filesDescription: string;
    relatedFilesFiles: string;
    relatedFilesDateDay: number;
    relatedFilesDateMonth: number;
    relatedFilesDateYear: number;
  }[];

  @Prop({ required: true })
  createdBy: string;

  @Prop({ required: true })
  ownerId: string;
}

export const CompanyProfileSchema = SchemaFactory.createForClass(MongoDBCompanyProfile);
