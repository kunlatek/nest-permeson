import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsArray, IsObject } from "class-validator";
import { ACL } from ".";

export class Workspace {
  @ApiProperty({
    example: '123456',
    description: 'ID do usuário',
  })
  @IsNotEmpty()
  @IsString()
  owner: string;

  @ApiProperty({
    example: ['123456', '789012'],
    description: 'ID dos usuários que estão no time',
  })
  @IsArray()
  @IsString({ each: true })
  team: string[];

  @ApiProperty({
    example: '123456',
    description: 'ID do usuário',
  })
  @IsNotEmpty()
  @IsString()
  name?: string;

  @ApiProperty({
    example: [
      {
        userId: '123456',
        role: 'admin',
      },
    ],
    description: 'ACL do workspace',
  })
  @IsArray()
  @IsObject({ each: true })
  acl?: ACL[];

  constructor(data: Partial<Workspace>) {
    Object.assign(this, data);
  }
}