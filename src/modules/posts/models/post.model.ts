import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsDateString, IsNumber, IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { UploadFile } from "../../../common/models";

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
