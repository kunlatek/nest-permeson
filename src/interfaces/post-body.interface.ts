import { ApiProperty } from "@nestjs/swagger";

export class IPostBody {

  @ApiProperty({
    example: '123456',
    description: 'ID do criado por',
  })
  createdBy?: string;

  constructor(createdBy?: string) {
    this.createdBy = createdBy;
  }
}