import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ACL {
  @ApiProperty({
    example: '123456',
    description: 'ID do usuário',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    example: 'admin',
    description: 'Cargo do usuário',
  })
  @IsNotEmpty()
  @IsString()
  role: string;
}