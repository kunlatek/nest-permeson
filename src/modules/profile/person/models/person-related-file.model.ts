import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class PersonRelatedFile {
  @ApiProperty({
    example: 'Comprovante de residência',
    description: 'Descrição do arquivo',
  })
  @IsString() 
  filesDescription?: string;

  @ApiProperty({
    example: 'comprovante.pdf',
    description: 'Nome do arquivo',
  })
  @IsString()
  relatedFilesFiles?: string;

  @ApiProperty({
    example: 15,
    description: 'Dia do arquivo',
  })
  @IsNumber()
  relatedFilesDateDay?: number;

  @ApiProperty({
    example: 1,
    description: 'Mês do arquivo',
  })
  @IsNumber()
  relatedFilesDateMonth?: number;

  @ApiProperty({
    example: 2021,
    description: 'Ano do arquivo',
  })
  @IsNumber()
  relatedFilesDateYear?: number;

  constructor(data: Partial<PersonRelatedFile>) {
    Object.assign(this, data);
  }
}