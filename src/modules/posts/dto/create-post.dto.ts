import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsDateString, IsNumber, IsOptional, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CoAuthor } from "../models";

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
    type: [String],
    example: ['technology', 'programming', 'nestjs'],
    description: 'Post tags',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    type: [CoAuthor],
    description: 'Post coauthors',
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CoAuthor)
  coauthors?: CoAuthor[];

  @ApiPropertyOptional({
    type: [String],
    example: ['post_id_1', 'post_id_2', 'post_id_3'],
    description: 'IDs de posts relacionados',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  relatedPosts?: string[];

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
