import { IHttpResponse, IHttpResponsePaginated } from "src/interfaces/http-response.interface";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsObject } from "class-validator";
import { InvitationResponseDto } from "../dto/invitation-response.dto";

export class IInvitationHttpResponse extends IHttpResponse {
    @ApiProperty({
        description: 'Invitation',
        type: InvitationResponseDto,
    })
    @IsObject()
    data: any;

    constructor(statusCode: number, message: string, data: any) {
        super(statusCode, message);
        this.data = data;
    }
}

export class IInvitationHttpResponsePaginated extends IHttpResponsePaginated {
    @ApiProperty({
        description: 'Invitations list',
        type: [InvitationResponseDto],
    })
    @IsArray()
    data: any[];

    constructor(data: any[], total: number, page: number, limit: number) {
        super(200, 'Invitations fetched successfully', total, page, limit);
        this.data = data;
    }
} 