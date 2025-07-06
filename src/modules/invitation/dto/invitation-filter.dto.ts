import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsObject, IsOptional, Min } from "class-validator";

export class InvitationFilterDto {
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

    @ApiPropertyOptional({ description: 'Filters for the query', example: { email: 'test@example.com' } })
    @IsObject()
    @IsOptional()
    filters?: Record<string, any>;

    @ApiPropertyOptional({ description: 'Sort options for the query', example: { createdAt: 'desc' } })
    @IsObject()
    @IsOptional()
    sort?: Record<string, any>;
}