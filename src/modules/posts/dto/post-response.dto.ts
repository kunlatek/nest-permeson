import { Post } from "../models";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class PostResponseDto extends Post {
  @ApiProperty({
    example: '123456',
    description: 'ID do post',
  })
  @IsString()
  @IsNotEmpty()
  _id: string;

  constructor(data: Partial<PostResponseDto>) {
    super(data);
    this._id = data._id.toString();
  }
}
