import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsDateString, IsNumber, IsOptional } from "class-validator";

export class CreatePostDto {
  @ApiProperty({
    example: 'My first post',
    description: 'Post title',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'This is the content of my post...',
    description: 'Post content',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    example: '2024-01-15',
    description: 'Publication date',
  })
  @IsNotEmpty()
  @IsDateString()
  publishedAt: string;

  @ApiProperty({
    example: 5,
    description: 'Reading time in minutes',
  })
  @IsNotEmpty()
  @IsNumber()
  readingTime: number;

  @ApiProperty({
    example: 'John Silva',
    description: 'Post author',
  })
  @IsNotEmpty()
  @IsString()
  author: string;

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
