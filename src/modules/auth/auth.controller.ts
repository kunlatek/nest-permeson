import { Controller, Post, Req, Body, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { LoginDto } from "./dto/login.dto";
import { SignupDto } from "./dto/signup.dto";
import { ResetPasswordDto, ResetPasswordRequestDto } from "./dto/reset-password.dto";
import { I18nLang } from "nestjs-i18n";
import { AuthLoginResponseDto, AuthSignupResponseDto } from "./dto/auth-response.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @Post("signup")
  @ApiOperation({ summary: "Register a new user" })
  @ApiResponse({ status: 201, description: "User registered successfully", type: AuthSignupResponseDto })
  async signup(
    @Body() signupDto: SignupDto,
    @I18nLang() lang?: string
  ): Promise<AuthSignupResponseDto> {
    return this.authService.signup(signupDto, lang);
  }

  @Post("login")
  @ApiOperation({ summary: "Local login with email/password" })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: "Returns JWT access token on successful login with available roles" })
  async login(
    @Body() loginDto: LoginDto,
    @I18nLang() lang?: string
  ): Promise<AuthLoginResponseDto> {
    return this.authService.login(loginDto, lang);
  }

  @Post("reset-password-request")
  @ApiOperation({ summary: "Send a password reset email" })
  @ApiBody({ type: ResetPasswordRequestDto })
  @ApiResponse({ status: 204, description: "Password reset email sent successfully", type: String })
  async resetPasswordRequest(
    @Body() resetPasswordRequestDto: ResetPasswordRequestDto,
    @I18nLang() lang?: string
  ): Promise<string> {
    return this.authService.resetPasswordRequest(resetPasswordRequestDto.email, lang);
  }

  @Post("reset-password")
  @ApiOperation({ summary: "Reset user password" })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: "Password reset successfully", type: String })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @I18nLang() lang?: string
  ): Promise<string> {
    return this.authService.resetPassword(resetPasswordDto, lang);
  }

  /*@Post("google/login")
  @ApiOperation({ summary: "Login via Google using ID Token" })
  @ApiBody({ type: GoogleLoginDto })
  @ApiResponse({ status: 200, description: "Returns JWT access token after validating Google ID Token" })
  async googleLoginWithToken(@Body() dto: GoogleLoginDto) {
    return this.authService.googleLogin(dto.idToken);
  }

  @Post("apple/login")
  @ApiOperation({ summary: "Login via Apple using ID Token" })
  @ApiBody({ type: AppleLoginDto })
  @ApiResponse({ status: 200, description: "Returns JWT access token after validating Apple ID Token" })
  async appleLoginWithToken(@Body() dto: AppleLoginDto) {
    return this.authService.appleLogin(dto.idToken);
  }*/
}
