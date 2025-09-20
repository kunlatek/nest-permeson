import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsDateString, IsNumber, IsOptional } from "class-validator";

export class CreatePostDto {
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

  @ApiPropertyOptional({
    example: 'user123',
    description: 'ID do owner (preenchido automaticamente pelo sistema)',
  })
  @IsOptional()
  @IsString()
  ownerId?: string;

  @ApiPropertyOptional({
    example: 'user123',
    description: 'ID do usuário criador (preenchido automaticamente pelo sistema)',
  })
  @IsOptional()
  @IsString()
  createdBy?: string;

  @ApiPropertyOptional({
    example: 'workspace123',
    description: 'ID do workspace (preenchido automaticamente pelo sistema)',
  })
  @IsOptional()
  @IsString()
  workspaceId?: string;
}
