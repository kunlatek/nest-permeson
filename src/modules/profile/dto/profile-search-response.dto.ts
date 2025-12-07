import { ApiProperty } from "@nestjs/swagger";

export class ProfileSearchResponseDto {
    @ApiProperty({
        description: 'Database ObjectId',
        example: '507f1f77bcf86cd799439011'
    })
    _id?: string;

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

    constructor(_id: string, userId: string, userName: string) {
        this._id = _id;
        this.userId = userId;
        this.userName = userName;
    }
}
