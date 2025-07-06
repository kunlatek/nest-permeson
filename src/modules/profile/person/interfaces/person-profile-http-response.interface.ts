import { IHttpResponse, IHttpResponsePaginated } from "src/interfaces/http-response.interface";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsObject } from "class-validator";
import { PersonProfileResponseDto } from "../dto/person-profile-response.dto";

class IPersonProfileHttpResponseCreateData {
    @ApiProperty({
        description: 'Person profile',
        type: PersonProfileResponseDto,
    })
    profile: PersonProfileResponseDto;

    @ApiProperty({
        description: 'JWT token',
        type: String,
    })
    token: string;
}

export class IPersonProfileHttpResponseCreate extends IHttpResponse {
    @ApiProperty({
        description: 'Person profile and token',
        type: IPersonProfileHttpResponseCreateData,
    })
    data: IPersonProfileHttpResponseCreateData;

    constructor(statusCode: number, message: string, data: IPersonProfileHttpResponseCreateData) {
        super(statusCode, message);
        this.data = data;
    }
}

export class IPersonProfileHttpResponse extends IHttpResponse {
    @ApiProperty({
        description: 'Person profile',
        type: PersonProfileResponseDto,
    })
    @IsObject()
    data: PersonProfileResponseDto;

    constructor(statusCode: number, message: string, data: PersonProfileResponseDto) {
        super(statusCode, message);
        this.data = data;
    }
}

export class IPersonProfileHttpResponsePaginated extends IHttpResponsePaginated {
    @ApiProperty({
        description: 'Person profiles list',
        type: [PersonProfileResponseDto],
    })
    @IsArray()
    data: PersonProfileResponseDto[];

    constructor(data: PersonProfileResponseDto[], total: number, page: number, limit: number) {
        super(200, 'Person profiles fetched successfully', total, page, limit);
        this.data = data;
    }
}