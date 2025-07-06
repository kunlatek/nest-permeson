import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { BankAccountTypeEnum } from "../enums";

export class CompanyBankData {
    @ApiPropertyOptional({ example: '341' })
    @IsOptional()
    @IsString()
    bankName?: string;

    @ApiPropertyOptional({ example: '1234' })
    @IsOptional()
    @IsString()
    bankBranch?: string;

    @ApiPropertyOptional({ example: '56789-0' })
    @IsOptional()
    @IsString()
    bankAccount?: string;

    @ApiPropertyOptional({ enum: BankAccountTypeEnum, example: BankAccountTypeEnum.CURRENT })
    @IsOptional()
    @IsEnum(BankAccountTypeEnum)
    bankAccountType?: BankAccountTypeEnum;
}