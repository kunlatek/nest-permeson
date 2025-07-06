import { IHttpResponse, IHttpResponsePaginated } from "src/interfaces/http-response.interface";
import { PersonProfile } from "../models";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsObject } from "class-validator";

class IPersonProfileHttpResponseCreateData {
    @ApiProperty({
        description: 'Person profile',
        type: PersonProfile,
    })
    profile: PersonProfile;

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
        type: PersonProfile,
    })
    @IsObject()
    data: PersonProfile;

    constructor(statusCode: number, message: string, data: PersonProfile) {
        super(statusCode, message);
        this.data = data;
    }
}

export class IPersonProfileHttpResponsePaginated extends IHttpResponsePaginated {
    @ApiProperty({
        description: 'Person profiles list',
        type: [PersonProfile],
    })
    @IsArray()
    data: PersonProfile[];

    constructor(data: PersonProfile[], total: number, page: number, limit: number) {
        super(200, 'Person profiles fetched successfully', total, page, limit);
        this.data = data;
    }
}