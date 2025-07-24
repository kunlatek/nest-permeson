import { Workspace } from "../models";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class WorkspaceResponseDto extends Workspace {
  @ApiProperty({
    example: '123456',
    description: 'ID do workspace',
  })
  @IsString()
  @IsNotEmpty()
  _id: string;

  constructor(data: Partial<WorkspaceResponseDto>) {
    super(data);
    this._id = data._id.toString();
  }
}