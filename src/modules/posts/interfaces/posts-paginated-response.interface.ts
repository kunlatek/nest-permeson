import { ApiProperty } from "@nestjs/swagger";
import { PostResponseDto } from "../dto";
import { IHttpResponse } from "src/interfaces/http-response.interface";

export class IPostsPaginatedHttpResponse extends IHttpResponse {
  @ApiProperty({
    type: [PostResponseDto],
    description: 'Lista de posts',
  })
  data: PostResponseDto[];

  @ApiProperty({
    description: 'Total number of posts',
    example: 100
  })
  total: number;

  @ApiProperty({
    description: 'Current page',
    example: 1
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10
  })
  limit: number;

  constructor(statusCode: number, message: string, data: PostResponseDto[], total: number, page: number, limit: number) {
    super(statusCode, message);
    this.data = data;
    this.total = total;
    this.page = page;
    this.limit = limit;
  }
}
