import { IHttpResponse, IHttpResponsePaginated } from "src/interfaces/http-response.interface";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsObject } from "class-validator";
import { CompanyProfileResponseDto } from "../dto/company-profile-response.dto";

class ICompanyProfileHttpResponseCreateData {
    @ApiProperty({
        description: 'Company profile',
        type: CompanyProfileResponseDto,
    })
    profile: CompanyProfileResponseDto;

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
        type: CompanyProfileResponseDto,
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
        type: [CompanyProfileResponseDto],
    })
    @IsArray()
    data: any[];

    constructor(data: any[], total: number, page: number, limit: number) {
        super(200, 'Company profiles fetched successfully', total, page, limit);
        this.data = data;
    }
} 