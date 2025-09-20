import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, Min } from "class-validator";
import { Type } from "class-transformer";

export class PostsFilterDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ 
    description: 'Number of items per page', 
    example: 10,
    default: 10,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit?: number = 10;
}
