import { IHttpResponse, IHttpResponsePaginated } from "src/interfaces/http-response.interface";
import { ApiProperty } from "@nestjs/swagger";
import { IsObject } from "class-validator";
import { CompanyProfile } from "../models";

export class ICompanyProfileHttpResponse extends IHttpResponse {
    @ApiProperty({
        description: 'Company profile',
        type: CompanyProfile,
    })
    @IsObject()
    data: CompanyProfile;

    constructor(statusCode: number, message: string, data: CompanyProfile) {
        super(statusCode, message);
        this.data = data;
    }
}