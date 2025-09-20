import { IHttpResponse, IHttpResponsePaginated } from "src/interfaces/http-response.interface";
import { ApiProperty } from "@nestjs/swagger";
import { IsObject } from "class-validator";
import { CompanyProfileResponseDto } from "../../company-profile/dto/company-profile-response.dto";

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