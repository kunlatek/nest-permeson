import { IHttpResponse, IHttpResponsePaginated } from "src/interfaces/http-response.interface";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsObject } from "class-validator";
import { PersonProfileResponseDto } from "../person/dto/person-profile-response.dto";

export class IPersonProfileHttpResponse extends IHttpResponse {
    @ApiProperty({
        description: 'Person profile',
        type: PersonProfileResponseDto,
    })
    @IsObject()
    data: PersonProfileResponseDto;

    constructor(statusCode: number, message: string, data: PersonProfileResponseDto) {
        super(statusCode, message);
        this.data = data;
    }
}