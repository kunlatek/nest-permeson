import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsBoolean, IsString, IsEmail } from "class-validator";

export class UpdateInvitationDto {
  @ApiPropertyOptional({
    example: 'user@example.com',
    description: 'Email do convidado',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Se o convite foi aceito',
  })
  @IsOptional()
  @IsBoolean()
  accepted?: boolean;
}

