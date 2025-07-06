import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class PersonCourse {
  @ApiProperty({
    example: 'Curso de inglês',
    description: 'Nome do curso',
  })
  @IsString()
  personCourseName?: string;
  
  @ApiProperty({
    example: 'Instituto de Ensino',
    description: 'Instituição do curso',
  })
  @IsString()
  personCourseInstitution?: string;
  
  @ApiProperty({
    example: '2021-01-01',
    description: 'Data de início do curso',
  })
  @IsDate()
  personCourseStartDate?: Date;

  @ApiProperty({
    example: '2021-01-01',
    description: 'Data de término do curso',
  })
  @IsDate()
  personCourseFinishDate?: Date;

  @ApiProperty({
    example: 'Certificado do curso',
    description: 'Certificado do curso',
  })
  @IsString()
  personCourseCertificateFile?: string;

  constructor(data: Partial<PersonCourse>) {
    Object.assign(this, data);
  }
}