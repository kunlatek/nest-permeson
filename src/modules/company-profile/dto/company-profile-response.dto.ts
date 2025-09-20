import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { CompanyProfile } from "../models/company-profile.model";

export class CompanyProfileResponseDto extends CompanyProfile {
    @ApiProperty({
        description: 'ID do perfil',
        example: '123456',
    })
    @IsString()
    @IsNotEmpty()
    _id: string;

    constructor(data: Partial<CompanyProfileResponseDto>) {
        super(data);
        this._id = data._id.toString();
    }
}