import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CompanyRelatedFile {
    @ApiProperty({ example: 'Descrição do arquivo' })
    @IsNotEmpty()
    @IsString()
    filesDescription: string;

    @ApiProperty({ example: 'arquivo.pdf' })
    @IsNotEmpty()
    @IsString()
    relatedFilesFiles: string;

    @ApiProperty({ example: 20 })
    @IsNotEmpty()
    @IsNumber()
    relatedFilesDateDay: number;

    @ApiProperty({ example: 4 })
    @IsNotEmpty()
    @IsNumber()
    relatedFilesDateMonth: number;

    @ApiProperty({ example: 2023 })
    @IsNotEmpty()
    @IsNumber()
    relatedFilesDateYear: number;
}