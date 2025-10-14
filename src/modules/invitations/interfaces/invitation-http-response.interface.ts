import { ApiProperty } from "@nestjs/swagger";
import { Invitation } from "../models";
import { IHttpResponse } from "src/interfaces/http-response.interface";

export class IInvitationHttpResponse extends IHttpResponse {
  @ApiProperty({
    type: Invitation,
    description: 'Dados do convite',
  })
  data: Invitation;

  constructor(statusCode: number, message: string, data: Invitation) {
    super(statusCode, message);
    this.data = data;
  }
}

export class IInvitationsHttpResponse extends IHttpResponse {
  @ApiProperty({
    type: [Invitation],
    description: 'Lista de convites',
  })
  data: Invitation[];

  constructor(statusCode: number, message: string, data: Invitation[]) {
    super(statusCode, message);
    this.data = data;
  }
}

