import { ApiProperty } from "@nestjs/swagger";

export class AuthSignupResponseDto {
  @ApiProperty({
    example: "Bearer <token>",
    description: "JWT access token",
  })
  access_token: string;

  constructor(token: string) {
    this.access_token = token;
  }
}

export class AuthLoginResponseDto {
  @ApiProperty({
    example: "Bearer <token>",
    description: "JWT access token",
  })
  access_token: string;

  constructor(token: string) {
    this.access_token = token;
  }
}