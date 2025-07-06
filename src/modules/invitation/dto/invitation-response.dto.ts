import { ApiProperty } from '@nestjs/swagger';
import { InvitationModel } from '../models';

export class InvitationResponseDto extends InvitationModel {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID do convite',
  })
  _id: string;

  constructor(data: Partial<InvitationResponseDto>) {
    super(data);
    this._id = data._id.toString();
  }
} 