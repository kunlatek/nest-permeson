import { ApiProperty } from "@nestjs/swagger";
import { PostResponseDto } from "../dto";
import { IHttpResponse } from "src/interfaces/http-response.interface";

export class IPostHttpResponse extends IHttpResponse {
  @ApiProperty({
    type: PostResponseDto,
    description: 'Dados do post',
  })
  data: PostResponseDto;

  constructor(statusCode: number, message: string, data: PostResponseDto) {
    super(statusCode, message);
    this.data = data;
  }
}

export class IPostsHttpResponse extends IHttpResponse {
  @ApiProperty({
    type: [PostResponseDto],
    description: 'Lista de posts',
  })
  data: PostResponseDto[];

  constructor(statusCode: number, message: string, data: PostResponseDto[]) {
    super(statusCode, message);
    this.data = data;
  }
}
