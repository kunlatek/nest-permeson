import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class Invitation {
    @ApiProperty({
        example: 'user@example.com',
        description: 'Email do usuário convidado',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: 'ADMIN',
        description: 'Role do usuário convidado',
    })
    @IsString()
    @IsNotEmpty()
    role: string;

    @ApiProperty({
        example: false,
        description: 'Status de aceitação do convite',
    })
    @IsBoolean()
    @IsOptional()
    accepted?: boolean = false;

    @ApiProperty({
        example: '2023-01-01T00:00:00.000Z',
        description: 'Data de aceitação do convite',
        required: false,
    })
    @IsDate()
    @IsOptional()
    acceptedAt?: Date = null;

    @ApiProperty({
        description: 'ID do usuário que está criando o convite',
        example: '507f1f77bcf86cd799439011',
    })
    @IsString()
    @IsNotEmpty()
    createdBy: string;

    @ApiProperty({
        description: 'ID do usuário que é o dono do convite',
        example: '507f1f77bcf86cd799439011',
        required: false,
    })
    @IsString()
    @IsOptional()
    ownerId?: string;
    
    constructor(data: Partial<Invitation>) {
        Object.assign(this, data);
    }
} 