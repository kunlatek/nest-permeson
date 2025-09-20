import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class PersonJob {
  @ApiProperty({
    example: '123456',
    description: 'ID do cargo',
  })
  @IsString()
  jobId?: string;
  
  @ApiProperty({
    example: 1,
    description: 'Mês de início do cargo',
  })
  @IsNumber()
  jobStartDateMonth?: number;
  
  @ApiProperty({
    example: 2021,
    description: 'Ano de início do cargo',
  })
  @IsNumber()
  jobStartDateYear?: number;
  
  @ApiProperty({
    example: 1,
    description: 'Mês de término do cargo',
  })
  @IsNumber()
  jobFinishDateMonth?: number;

  @ApiProperty({
    example: 2021,
    description: 'Ano de término do cargo',
  })
  @IsNumber()
  jobFinishDateYear?: number;

  @ApiProperty({
    example: 'Descrição do cargo',
    description: 'Descrição do cargo',
  })
  @IsString()
  jobDescription?: string;

  constructor(data: Partial<PersonJob>) {
    Object.assign(this, data);
  }
}