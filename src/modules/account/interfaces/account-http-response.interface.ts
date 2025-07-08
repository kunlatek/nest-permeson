import { IHttpResponse } from "src/interfaces/http-response.interface";
import { AccountStatusDto } from "../dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsObject, IsString } from "class-validator";

export class IAccountStatusHttpResponse extends IHttpResponse {
    @ApiProperty({
        description: 'Account status',
        type: AccountStatusDto,
    })
    @IsObject()
    data: AccountStatusDto;

    constructor(statusCode: number, message: string, data: AccountStatusDto) {
        super(statusCode, message);
        this.data = data;
    }
}