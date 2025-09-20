import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsDateString, IsNumber, IsOptional } from "class-validator";

export class Post {
  @ApiProperty({
    example: 'Meu primeiro post',
    description: 'Título do post',
  })
  @IsNotEmpty()
  @IsString()
  titulo: string;

  @ApiProperty({
    example: 'Este é o conteúdo do meu post...',
    description: 'Conteúdo do post',
  })
  @IsNotEmpty()
  @IsString()
  conteudo: string;

  @ApiProperty({
    example: '2024-01-15',
    description: 'Data da publicação',
  })
  @IsNotEmpty()
  @IsDateString()
  dataPublicacao: string;

  @ApiProperty({
    example: 5,
    description: 'Tempo de leitura em minutos',
  })
  @IsNotEmpty()
  @IsNumber()
  tempoLeitura: number;

  @ApiProperty({
    example: 'João Silva',
    description: 'Autor do post',
  })
  @IsNotEmpty()
  @IsString()
  autor: string;

  @ApiProperty({
    example: 'workspace123',
    description: 'ID do workspace',
  })
  @IsNotEmpty()
  @IsString()
  workspace: string;

  @ApiProperty({
    example: 'user123',
    description: 'ID do usuário que criou o post',
  })
  @IsNotEmpty()
  @IsString()
  createdBy: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    description: 'Data de criação',
  })
  @IsOptional()
  @IsDateString()
  createdAt?: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    description: 'Data de atualização',
  })
  @IsOptional()
  @IsDateString()
  updatedAt?: string;

  constructor(data: Partial<Post>) {
    Object.assign(this, data);
  }
}
