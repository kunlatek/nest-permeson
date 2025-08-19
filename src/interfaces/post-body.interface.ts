import { ApiProperty } from "@nestjs/swagger";

export class IPostBody {

  @ApiProperty({
    example: '123456',
    description: 'ID do owner',
  })
  ownerId?: string;

  @ApiProperty({
    example: '123456',
    description: 'ID do criado por',
  })
  createdBy?: string;

  constructor(ownerId?: string, createdBy?: string) {
    this.ownerId = ownerId;
    this.createdBy = createdBy;
  }
}