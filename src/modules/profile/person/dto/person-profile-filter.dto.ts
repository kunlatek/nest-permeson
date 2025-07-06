import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, Min } from "class-validator";

export class PersonProfileFilterDto {
    @ApiPropertyOptional({
        description: 'Page number for pagination',
        example: 1,
    })
    @IsNumber()
    @Min(1)
    @IsOptional()
    page?: number;

    @ApiPropertyOptional({ description: 'Number of items per page', example: 10 })
    @IsNumber()
    @Min(1)
    @IsOptional()
    limit?: number;
}