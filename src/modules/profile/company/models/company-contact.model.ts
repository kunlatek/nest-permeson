import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ContactType } from "../enums";

export class CompanyContact {
    @ApiProperty({ enum: ContactType, example: ContactType.PHONE })
    @IsNotEmpty()
    @IsEnum(ContactType)
    contactType: ContactType;

    @ApiProperty({ example: '+55 11 91234-5678' })
    @IsNotEmpty()
    @IsString()
    contactValue: string;

    @ApiProperty({ example: 'WhatsApp' })
    @IsNotEmpty()
    @IsString()
    contactComplement: string;
}