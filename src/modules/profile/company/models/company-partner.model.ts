import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CompanyPartner {
    @ApiProperty({
        example: 'personId',
        description: 'Reference to person',
    })
    @IsNotEmpty()
    @IsString()
    personId: string;
}