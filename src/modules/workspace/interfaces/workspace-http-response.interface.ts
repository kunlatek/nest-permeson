import { ApiProperty } from "@nestjs/swagger";
import { IHttpResponse } from "src/interfaces/http-response.interface";
import { Workspace } from "../models";
import { WorkspaceResponseDto } from "../dto";

export class IWorkspaceHttpResponse extends IHttpResponse {
    @ApiProperty({
        description: 'Data',
        type: Workspace,
    })
    data: WorkspaceResponseDto;

    constructor(statusCode: number, message: string, data: WorkspaceResponseDto) {
        super(statusCode, message);
        this.data = data;
    }
}

export class IMyWorkspacesHttpResponse extends IHttpResponse {
    @ApiProperty({
        description: 'Data',
        type: [Workspace],
    })
    data: WorkspaceResponseDto[];

    constructor(statusCode: number, message: string, data: WorkspaceResponseDto[]) {
        super(statusCode, message);
        this.data = data;
    }
}

export class IWorkspaceTokenHttpResponse extends IHttpResponse {
    @ApiProperty({
        description: 'Token',
        type: String,
        example: '1234567890',
    })
    data: string;

    constructor(statusCode: number, message: string, data: string) {
        super(statusCode, message);
        this.data = data;
    }
}