import { EducationLevelEnum } from "../enums";
import { PersonBankData, PersonCourse, PersonEducation, PersonJob, PersonRelatedFile } from ".";
import { IsArray, IsDate, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class PersonProfile {
  @ApiProperty({
    example: '123456',
    description: 'ID do usuário',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Nome do usuário',
  })
  @IsNotEmpty()
  @IsString()
  userName: string;
  
  @ApiProperty({
    example: 'John Doe',
    description: 'Nome do usuário',
  })
  @IsNotEmpty()
  @IsString()
  personName?: string;
  
  @ApiProperty({
    example: 'John Doe',
    description: 'Apelido do usuário',
  })
  @IsString()
  personNickname?: string;
  
  @ApiProperty({
    example: 'Masculino',
    description: 'Gênero do usuário',
  })
  @IsNotEmpty()
  @IsString()
  gender?: string;

  @ApiProperty({
    example: '1990-01-01',
    description: 'Data de nascimento do usuário',
  })
  @IsNotEmpty()
  @IsDate()
  birthday?: Date;
  
  @ApiProperty({
    example: 'Solteiro',
    description: 'Estado civil do usuário',
  })
  @IsNotEmpty()
  @IsString()
  maritalStatus?: string;
  
  @ApiProperty({
    example: 'Maria',
    description: 'Nome da mãe do usuário',
  })
  @IsString()
  motherName?: string;
  
  @ApiProperty({
    example: ['123456', '789012'],
    description: 'IDs das tags do usuário',
  })
  @IsArray()
  tagId?: string[];

  @ApiProperty({
    example: 'Descrição do usuário',
    description: 'Descrição do usuário',
  })
  @IsString()
  personDescription?: string;

  // 🔹 Documentos
  @ApiProperty({
    example: '123456',
    description: 'CPF do usuário',
  })
  @IsNotEmpty()
  @IsString()
  cpf?: string;
  
  @ApiProperty({
    example: '123456',
    description: 'CPF do usuário',
  })
  @IsString()
  cpfFile?: string;

  @ApiProperty({
    example: '123456',
    description: 'RG do usuário',
  })
  @IsString()
  rg?: string;

  @ApiProperty({
    example: '123456',
    description: 'RG do usuário',
  })
  @IsString()
  rgIssuingAuthority?: string;
  
  @ApiProperty({
    example: '1990-01-01',
    description: 'Data de emissão do RG do usuário',
  })
  @IsDate()
  rgIssuanceDate?: Date;
  
  @ApiProperty({
    example: 'SP',
    description: 'Estado do RG do usuário',
  })
  @IsString()
  rgState?: string;

  @ApiProperty({
    example: '123456',
    description: 'RG do usuário',
  })
  @IsString()
  rgFile?: string;
  
  @ApiProperty({
    example: '123456',
    description: 'Passaporte do usuário',
  })
  @IsString()
  passport?: string;
  
  @ApiProperty({
    example: '1990-01-01',
    description: 'Data de emissão do passaporte do usuário',
  })
  @IsDate()
  passportIssuanceDate?: Date;
  
  @ApiProperty({
    example: '1990-01-01',
    description: 'Data de expiração do passaporte do usuário',
  })
  @IsDate()
  passportExpirationDate?: Date;
  
  // 🔹 Contatos
  @ApiProperty({
    example: '123456',
    description: 'Número de telefone do usuário',
  })
  @IsString()
  phoneNumberOne?: string;
  
  @ApiProperty({
    example: '123456',
    description: 'Número de telefone do usuário',
  })
  @IsString()
  phoneNumberTwo?: string;

  @ApiProperty({
    example: '123456',
    description: 'Email do usuário',
  })
  @IsString()
  emailOne?: string;
  
  @ApiProperty({
    example: '123456',
    description: 'Email do usuário',
  })
  @IsString()
  emailTwo?: string;
  
  @ApiProperty({
    example: '123456',
    description: 'Linkedin do usuário',
  })
  @IsString()
  linkedin?: string;
  
  @ApiProperty({
    example: '123456',
    description: 'Instagram do usuário',
  })  
  @IsString()
  instagram?: string;
  
  @ApiProperty({
    example: '123456',
    description: 'Facebook do usuário',
  })
  @IsString()
  facebook?: string;
  
  // 🔹 Endereços
  
  @ApiProperty({
    example: '123456',
    description: 'CEP do usuário',
  })
  @IsString()
  addressOneCepBrasilApi?: string;
  
  @ApiProperty({
    example: '123456',
    description: 'Tipo de endereço do usuário',
  })
  @IsString()
  addressOneType?: string;
  
  @ApiProperty({
    example: '123456',
    description: 'Rua do usuário',
  })
  @IsString()
  addressOneStreet?: string;
  
  @ApiProperty({
    example: '123456',
    description: 'Número do endereço do usuário',
  })
  @IsString()
  addressOneNumber?: string;
  
  @ApiProperty({
    example: '123456',
    description: 'Cidade do usuário',
  })
  @IsString()
  addressOneCity?: string;
  
  
  @ApiProperty({
    example: '123456',
    description: 'Estado do usuário',
  })
  @IsString()
  addressOneState?: string;
  
  
  @ApiProperty({
    example: '123456',
    description: 'CEP do usuário',
  })
  @IsString()
  addressTwoCepBrasilApi?: string;
  
  @ApiProperty({
    example: '123456',
    description: 'Tipo de endereço do usuário',
  })
  @IsString()
  addressTwoType?: string;
  
  @ApiProperty({
    example: '123456',
    description: 'Rua do usuário',
  })
  @IsString()
  addressTwoStreet?: string;
  
  @ApiProperty({
    example: '123456',
    description: 'Número do endereço do usuário',
  })
  @IsString()
  addressTwoNumber?: string;
  
  @ApiProperty({
    example: '123456',
    description: 'Cidade do usuário',
  })
  @IsString()
  addressTwoCity?: string;
  
  @ApiProperty({
    example: '123456',
    description: 'Estado do usuário',
  })
  @IsString()
  addressTwoState?: string;
  
  // 🔹 Profissões
  @ApiProperty({
    type: [PersonJob],
    description: 'Profissões do usuário',
  })
  @IsArray()
  professions?: PersonJob[];
  
  // 🔹 Educação
  @ApiProperty({
    example: EducationLevelEnum.COMPLETE_ELEMENTARY,
    enum: EducationLevelEnum,
    description: 'Nível de educação do usuário',
  })
  @IsString()
  personEducation?: EducationLevelEnum;
  
  @ApiProperty({
    type: [PersonEducation],
    description: 'Cursos do usuário',
  })
  @IsArray()
  personEducations?: PersonEducation[];

  @ApiProperty({
    type: [PersonCourse],
    description: 'Cursos do usuário',
  })
  @IsArray()
  personCourses?: PersonCourse[];
  
  @ApiProperty({
    example: '123456',
    description: 'Idiomas do usuário',
  })
  @IsArray()
  personLanguages?: string[];
  
  
  // 🔹 Banco
  @ApiProperty({
    type: [PersonBankData],
    description: 'Banco do usuário',
  })
  bankData?: PersonBankData[];
  
  // 🔹 Arquivos relacionados
  @ApiProperty({
    type: [PersonRelatedFile],
    description: 'Arquivos relacionados do usuário',
  })
  @IsArray()
  relatedFiles?: PersonRelatedFile[];

  @ApiProperty({
    example: '123456',
    description: 'Criado por',
  })
  @IsString()
  createdBy: string;
  
  @ApiProperty({
    example: '123456',
    description: 'ID do usuário',
  })
  @IsString()
  ownerId: string;

  constructor(data: Partial<PersonProfile>) {
    Object.assign(this, data);
  }
}