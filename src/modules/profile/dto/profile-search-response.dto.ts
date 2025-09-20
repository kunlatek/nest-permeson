import { ApiProperty } from "@nestjs/swagger";

export class ProfileSearchResponseDto {
    @ApiProperty({
        description: 'User ID',
        example: '507f1f77bcf86cd799439011'
    })
    userId: string;

    @ApiProperty({
        description: 'Username',
        example: 'john_doe'
    })
    userName: string;

    constructor(userId: string, userName: string) {
        this.userId = userId;
        this.userName = userName;
    }
}
