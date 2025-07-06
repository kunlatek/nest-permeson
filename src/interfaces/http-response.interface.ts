import { ApiProperty } from "@nestjs/swagger";

export class IHttpResponse {

  @ApiProperty({
    example: 200,
    description: 'Status code',
  })
  statusCode: number;

  @ApiProperty({
    example: 'Success message',
    description: 'Message',
  })
  message: string;

  constructor(statusCode: number, message: string) {
    this.statusCode = statusCode;
    this.message = message;
  }
}

export class IHttpResponsePaginated {
  @ApiProperty({
    example: 200,
    description: 'Status code',
  })
  statusCode: number;

  @ApiProperty({
    example: 'Success message',
    description: 'Message',
  })
  message: string;

  @ApiProperty({
    example: 10,
    description: 'Total',
  })
  total: number;

  @ApiProperty({
    example: 1,
    description: 'Page',
  })
  page: number;

  @ApiProperty({
    example: 10,
    description: 'Limit',
  })
  limit: number;

  constructor(statusCode: number, message: string, total: number, page: number, limit: number) {
    this.statusCode = statusCode;
    this.message = message;
    this.total = total;
    this.page = page;
    this.limit = limit;
  }
}