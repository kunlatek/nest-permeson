import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { PersonProfile } from "../models";

export class PersonProfileResponseDto extends PersonProfile {
    @ApiProperty({
        description: 'ID do perfil',
        example: '123456',
    })
    @IsString()
    @IsNotEmpty()
    _id: string;

    constructor(data: Partial<PersonProfileResponseDto>) {
        super(data);
        this._id = data._id.toString();  
    }
}