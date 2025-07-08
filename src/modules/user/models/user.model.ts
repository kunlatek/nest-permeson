import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsEmail, IsNotEmpty, IsOptional, MinLength } from "class-validator";

export class User {
    @ApiProperty({
        example: 'john.doe@example.com',
        description: 'User e-mail, must be unique',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'p4s$W0rd!',
        description: 'Password with a minimum length of 8 characters',
    })
    @IsNotEmpty()
    @MinLength(8)
    password: string;

    @ApiProperty({
        example: '2021-01-01',
        description: 'Date of deletion',
    })
    @IsDate()
    @IsOptional()
    deletedAt?: Date;

    @ApiProperty({
        example: true,
        description: 'If the user is verified',
    })
    @IsBoolean()
    @IsOptional()
    verified?: boolean = false;
} 