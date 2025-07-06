import { ApiProperty } from "@nestjs/swagger";
import { BankAccountTypeEnum } from "../enums";

export class PersonBankData {
  @ApiProperty({
    example: 'Banco do Brasil',
    description: 'Nome do banco',
  })  
  bankName?: string;

  @ApiProperty({
    example: '1234',
    description: 'Agência do banco',
  })
  bankBranch?: string;

  @ApiProperty({
    example: '123456',
    description: 'Conta do banco',
  })
  bankAccount?: string;

  @ApiProperty({
    example: BankAccountTypeEnum.CURRENT,
    description: 'Tipo de conta',
    enum: BankAccountTypeEnum,
  })
  bankAccountType?: BankAccountTypeEnum;

  constructor(data: Partial<PersonBankData>) {
    Object.assign(this, data);
  }
}