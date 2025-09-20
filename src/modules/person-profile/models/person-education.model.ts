import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsString } from "class-validator";

export class PersonEducation {
  @ApiProperty({
    example: 'Curso de inglês',
    description: 'Nome do curso',
  })
  @IsString()
  personEducationCourse?: string;

  @ApiProperty({
    example: 'Instituto de Ensino',
    description: 'Instituição do curso',
  })
  @IsString()
  personEducationInstitution?: string;

  @ApiProperty({
    example: '2021-01-01',
    description: 'Data de início do curso',
  })
  @IsDate()
  personEducationStartDate?: Date;

  @ApiProperty({
    example: '2021-01-01',
    description: 'Data de término do curso',
  })
  @IsDate()
  personEducationFinishDate?: Date;

  @ApiProperty({
    example: 'Descrição do curso',
    description: 'Descrição do curso',
  })
  @IsString()
  personEducationDescription?: string;

  @ApiProperty({
    example: 'Certificado do curso',
    description: 'Certificado do curso',
  })
  @IsString()
  personEducationCertificateFile?: string;

  constructor(data: Partial<PersonEducation>) {
    Object.assign(this, data);
  }
}