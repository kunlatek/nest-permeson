import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsDateString, IsNumber, IsOptional, ValidateNested, IsArray } from "class-validator";
import { Type } from "class-transformer";
import { UploadFile } from "../../../common/models";

export class CoAuthor {
  @ApiProperty({
    example: 'Jane Doe',
    description: 'Coauthor name',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Subject matter expert',
    description: 'Coauthor subject',
  })
  @IsNotEmpty()
  @IsString()
  subject: string;

  @ApiProperty({
    example: 'https://example.com/jane-doe',
    description: 'Coauthor link',
  })
  @IsOptional()
  @IsString()
  link?: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Coauthor phone',
  })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class Post {
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
    type: [UploadFile],
    description: 'Post cover images',
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UploadFile)
  cover?: UploadFile[];

  @ApiProperty({
    type: [String],
    example: ['technology', 'programming', 'nestjs'],
    description: 'Post tags',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    type: [CoAuthor],
    description: 'Post coauthors',
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CoAuthor)
  coauthors?: CoAuthor[];

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
