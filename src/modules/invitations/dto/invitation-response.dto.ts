import { Invitation } from "../models";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class InvitationResponseDto extends Invitation {
  @ApiProperty({
    example: '123456',
    description: 'ID do convite',
  })
  @IsString()
  @IsNotEmpty()
  _id: string;

  constructor(data: Partial<InvitationResponseDto>) {
    super(data);
    this._id = data._id?.toString();
  }
}

