import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateWorkspaceTeamDto {
  @ApiProperty({
    example: '123456',
    description: 'ID do usuário a ser adicionado ao time',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
}