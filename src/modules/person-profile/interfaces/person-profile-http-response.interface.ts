import { IHttpResponse } from "src/interfaces/http-response.interface";
import { ApiProperty } from "@nestjs/swagger";
import { IsObject } from "class-validator";
import { PersonProfile } from "../models";

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