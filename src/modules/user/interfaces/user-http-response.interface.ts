import { IHttpResponse, IHttpResponsePaginated } from "src/interfaces/http-response.interface";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsObject } from "class-validator";
import { UserResponseDto } from "../dto";

export class IUserHttpResponse extends IHttpResponse {
    @ApiProperty({
        description: 'User',
        type: UserResponseDto,
    })
    @IsObject()
    data: any;

    constructor(statusCode: number, message: string, data: any) {
        super(statusCode, message);
        this.data = data;
    }
}

export class IUserHttpResponsePaginated extends IHttpResponsePaginated {
    @ApiProperty({
        description: 'Users list',
        type: [UserResponseDto],
    })
    @IsArray()
    data: any[];

    constructor(data: any[], total: number, page: number, limit: number) {
        super(200, 'Users fetched successfully', total, page, limit);
        this.data = data;
    }
} 