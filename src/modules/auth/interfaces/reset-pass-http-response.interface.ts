import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { IHttpResponse } from "src/interfaces/http-response.interface";

export class IResetPasswordHttpResponse extends IHttpResponse {
    @ApiProperty({
        description: 'Reset password response',
        type: String,
        example: "Password reset email sent successfully"
    })
    @IsString()
    data: string;

    constructor(statusCode: number, message: string, data: string) {
        super(statusCode, message);
        this.data = data;
    }
}