import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsDate, IsNotEmpty, IsString, IsOptional } from "class-validator";
import { AddressType } from "../enums/address-type.enum";
import { CompanyContact, CompanyPartner, CompanyBankData, CompanyRelatedFile } from ".";

export class CompanyProfile {
  @ApiProperty({ example: 'userId', description: 'ID do usuário' })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ example: 'John Doe', description: 'Nome do usuário' })
  @IsNotEmpty()
  @IsString()
  userName: string;

  @ApiProperty({ example: '12.345.678/0001-90' })
  @IsOptional()
  @IsString()
  cnpj?: string;

  @ApiProperty({ example: 'Empresa ABC LTDA' })
  @IsNotEmpty()
  @IsString()
  companyName?: string;

  @ApiProperty({ example: 'ABC Negócios' })
  @IsNotEmpty()
  @IsString()
  businessName?: string;

  @ApiPropertyOptional({
    example: '2001-01-01',
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDate()
  birthday?: Date;

  @ApiPropertyOptional({ example: 'Sociedade Limitada' })
  @IsOptional()
  @IsString()
  legalNature?: string;

  @ApiPropertyOptional({ example: 'Empresa especializada em...' })
  @IsOptional()
  @IsString()
  companyDescription?: string;

  @ApiPropertyOptional({ example: 'logo.png' })
  @IsOptional()
  @IsString()
  logoImage?: string;

  @ApiPropertyOptional({ example: ['foto1.png', 'foto2.png'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  companyImages?: string[];

  @ApiProperty({
    description: 'Related tag IDs',
    example: ['tagId1', 'tagId2'],
    isArray: true,
  })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  tagId?: string[];

  // Sócios
  @ApiProperty({ 
    type: () => [CompanyPartner],
    description: 'Company partners',
  })
  @IsOptional()
  @IsArray()
  partners?: CompanyPartner[];

  // Contatos
  @ApiProperty({ 
    type: () => [CompanyContact],
    description: 'Company contacts',
  })
  @IsOptional()
  @IsArray()
  contacts?: CompanyContact[];

  // Endereço 1
  @ApiPropertyOptional({ example: '01001-000' })
  @IsOptional()
  @IsString()
  addressOneCepBrasilApi?: string;

  @ApiPropertyOptional({ enum: AddressType, example: AddressType.COMMERCIAL })
  @IsOptional()
  @IsString()
  addressOneType?: string;

  @ApiPropertyOptional({ example: 'Av. Paulista' })
  @IsOptional()
  @IsString()
  addressOneStreet?: string;

  @ApiPropertyOptional({ example: '1000' })
  @IsOptional()
  @IsString()
  addressOneNumber?: string;

  @ApiPropertyOptional({ example: 'Fundos' })
  @IsOptional()
  @IsString()
  addressOneComplement?: string;

  @ApiPropertyOptional({ example: 'São Paulo' })
  @IsOptional()
  @IsString()
  addressOneCity?: string;

  @ApiPropertyOptional({ example: 'SP' })
  @IsOptional()
  @IsString()
  addressOneState?: string;

  // Endereço 2
  @ApiPropertyOptional({ example: '02002-000' })
  @IsOptional()
  @IsString()
  addressTwoCepBrasilApi?: string;

  @ApiPropertyOptional({ enum: AddressType, example: AddressType.RESIDENTIAL })
  @IsOptional()
  @IsString()
  addressTwoType?: string;

  @ApiPropertyOptional({ example: 'Rua das Flores' })
  @IsOptional()
  @IsString()
  addressTwoStreet?: string;

  @ApiPropertyOptional({ example: '222' })
  @IsOptional()
  @IsString()
  addressTwoNumber?: string;

  @ApiPropertyOptional({ example: 'Casa' })
  @IsOptional()
  @IsString()
  addressTwoComplement?: string;

  @ApiPropertyOptional({ example: 'Campinas' })
  @IsOptional()
  @IsString()
  addressTwoCity?: string;

  @ApiPropertyOptional({ example: 'SP' })
  @IsOptional()
  @IsString()
  addressTwoState?: string;

  // Bancos
  @ApiProperty({ 
    type: () => CompanyBankData,
    description: 'Company bank data',
  })
  @IsOptional()
  bankDataOne?: CompanyBankData;

  @ApiProperty({ 
    type: () => CompanyBankData,
    description: 'Company bank data',
  })
  @IsOptional()
  bankDataTwo?: CompanyBankData;

  // Arquivos
  @ApiProperty({ 
    type: () => [CompanyRelatedFile],
    description: 'Company related files',
  })
  @IsOptional()
  @IsArray()
  relatedFiles?: CompanyRelatedFile [];

  @ApiProperty({ example: 'userId', readOnly: true })
  @IsNotEmpty()
  @IsString()
  createdBy: string;

  @ApiProperty({ example: 'userId', readOnly: true })
  @IsNotEmpty()
  @IsString()
  ownerId: string;

  constructor(data: Partial<CompanyProfile>) {
    Object.assign(this, data);
  }
} 