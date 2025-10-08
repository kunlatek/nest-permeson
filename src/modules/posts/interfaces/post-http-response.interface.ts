import { ApiProperty } from "@nestjs/swagger";
import { Post } from "../models";
import { IHttpResponse } from "src/interfaces/http-response.interface";

export class IPostHttpResponse extends IHttpResponse {
  @ApiProperty({
    type: Post,
    description: 'Dados do post',
  })
  data: Post;

  constructor(statusCode: number, message: string, data: Post) {
    super(statusCode, message);
    this.data = data;
  }
}

export class IPostsHttpResponse extends IHttpResponse {
  @ApiProperty({
    type: [Post],
    description: 'Lista de posts',
  })
  data: Post[];

  constructor(statusCode: number, message: string, data: Post[]) {
    super(statusCode, message);
    this.data = data;
  }
}
