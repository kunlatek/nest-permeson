import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UploadFile {
  @ApiProperty({
    example: 'file-name.jpg',
    description: 'File name',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'https://example.com/files/file-name.jpg',
    description: 'File URL',
  })
  @IsNotEmpty()
  @IsString()
  url: string;

  constructor(data: Partial<UploadFile>) {
    Object.assign(this, data);
  }
}
