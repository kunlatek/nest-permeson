import { ApiProperty } from '@nestjs/swagger';
import { User } from '../models';

export class UserResponseDto extends User {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID do usuário',
  })
  _id: string;

  constructor(data: Partial<UserResponseDto>) {
    super();
    Object.assign(this, data);
    this._id = data._id?.toString();
  }
} 