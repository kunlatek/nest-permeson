import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsArray } from "class-validator";

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

  constructor(data: Partial<Workspace>) {
    Object.assign(this, data);
  }
}