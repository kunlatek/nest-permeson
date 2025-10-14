import { ApiProperty } from "@nestjs/swagger";
import { Invitation } from "../models";
import { IHttpResponse } from "src/interfaces/http-response.interface";

export class IInvitationsPaginatedHttpResponse extends IHttpResponse {
  @ApiProperty({
    type: [Invitation],
    description: 'Lista de convites',
  })
  data: Invitation[];

  @ApiProperty({
    example: 100,
    description: 'Total de convites',
  })
  total: number;

  @ApiProperty({
    example: 1,
    description: 'Página atual',
  })
  page: number;

  @ApiProperty({
    example: 10,
    description: 'Items por página',
  })
  limit: number;

  constructor(
    statusCode: number,
    message: string,
    data: Invitation[],
    total: number,
    page: number,
    limit: number,
  ) {
    super(statusCode, message);
    this.data = data;
    this.total = total;
    this.page = page;
    this.limit = limit;
  }
}

