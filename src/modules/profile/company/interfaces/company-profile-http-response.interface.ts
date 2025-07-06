import { IHttpResponse, IHttpResponsePaginated } from "src/interfaces/http-response.interface";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsObject } from "class-validator";
import { CompanyProfile } from "../models/company-profile.model";

class ICompanyProfileHttpResponseCreateData {
    @ApiProperty({
        description: 'Company profile',
        type: CompanyProfile,
    })
    profile: any;

    @ApiProperty({
        description: 'JWT token',
        type: String,
    })
    token: string;
}

export class ICompanyProfileHttpResponseCreate extends IHttpResponse {
    @ApiProperty({
        description: 'Company profile and token',
        type: ICompanyProfileHttpResponseCreateData,
    })
    data: ICompanyProfileHttpResponseCreateData;

    constructor(statusCode: number, message: string, data: ICompanyProfileHttpResponseCreateData) {
        super(statusCode, message);
        this.data = data;
    }
}

export class ICompanyProfileHttpResponse extends IHttpResponse {
    @ApiProperty({
        description: 'Company profile',
        type: CompanyProfile,
    })
    @IsObject()
    data: any;

    constructor(statusCode: number, message: string, data: any) {
        super(statusCode, message);
        this.data = data;
    }
}

export class ICompanyProfileHttpResponsePaginated extends IHttpResponsePaginated {
    @ApiProperty({
        description: 'Company profiles list',
        type: [CompanyProfile],
    })
    @IsArray()
    data: any[];

    constructor(data: any[], total: number, page: number, limit: number) {
        super(200, 'Company profiles fetched successfully', total, page, limit);
        this.data = data;
    }
} 