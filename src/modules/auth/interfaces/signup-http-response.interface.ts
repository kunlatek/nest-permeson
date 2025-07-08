import { IHttpResponse } from "../../../interfaces/http-response.interface";
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { AuthSignupResponseDto } from "../dto";

export class ISignupHttpResponse extends IHttpResponse {
    @ApiProperty({
        description: 'JWT access token',
        type: AuthSignupResponseDto,
    })
    @IsString()
    data: AuthSignupResponseDto;

    constructor(statusCode: number, message: string, data: AuthSignupResponseDto) {
        super(statusCode, message);
        this.data = data;
    }
}