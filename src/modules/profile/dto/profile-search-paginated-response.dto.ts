import { ApiProperty } from "@nestjs/swagger";
import { ProfileSearchResponseDto } from "./profile-search-response.dto";

export class ProfileSearchPaginatedResponseDto {
    @ApiProperty({
        description: 'Status code',
        example: 200
    })
    statusCode: number;

    @ApiProperty({
        description: 'Message',
        example: 'Profiles found successfully'
    })
    message: string;

    @ApiProperty({
        description: 'List of profiles found',
        type: [ProfileSearchResponseDto]
    })
    data: ProfileSearchResponseDto[];

    @ApiProperty({
        description: 'Total number of profiles',
        example: 100
    })
    total: number;

    @ApiProperty({
        description: 'Current page',
        example: 1
    })
    page: number;

    @ApiProperty({
        description: 'Number of items per page',
        example: 10
    })
    limit: number;

    constructor(statusCode: number, message: string, data: ProfileSearchResponseDto[], total: number, page: number, limit: number) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.total = total;
        this.page = page;
        this.limit = limit;
    }
}
