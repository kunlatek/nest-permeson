import { IHttpResponse } from "../../../interfaces/http-response.interface";
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { AuthLoginResponseDto } from "../dto";

export class ILoginHttpResponse extends IHttpResponse {
    @ApiProperty({
        description: 'JWT access token',
        type: AuthLoginResponseDto,
    })
    @IsString()
    data: AuthLoginResponseDto;

    constructor(statusCode: number, message: string, data: AuthLoginResponseDto) {
        super(statusCode, message);
        this.data = data;
    }
}