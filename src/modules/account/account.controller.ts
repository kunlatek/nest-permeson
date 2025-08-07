import { Body, Controller, Get, HttpCode, Post, Query } from "@nestjs/common";
import { AccountService } from "./account.service";
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { I18nLang } from "nestjs-i18n";
import { VerifyAccountSendMailDto } from "./dto";
import { IAccountStatusHttpResponse } from "./interfaces/account-http-response.interface";
import { IHttpResponse } from "src/interfaces/http-response.interface";

@ApiTags('Account')
@Controller('account')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
  ) {}

  @Post('verify/send')
  @HttpCode(200)
  @ApiOperation({ summary: 'Send verify email' })
  @ApiResponse({ status: 200, description: 'Verify email sent', type: IHttpResponse })
  @ApiBody({ type: VerifyAccountSendMailDto })
  async sendVerifyEmail(
    @Body() body: VerifyAccountSendMailDto,
    @I18nLang() lang?: string
  ): Promise<IHttpResponse> {
    return this.accountService.sendVerifyEmail(body.email, lang);
  }

  @Get('verify')
  @ApiOperation({ summary: 'Verify account' })
  @ApiResponse({ status: 200, description: 'Account verified', type: IHttpResponse })
  @ApiQuery({ name: 'token', type: String })
  @ApiQuery({ name: 'email', type: String })
  async verify(
    @Query('token') token: string,
    @Query('email') email: string,
    @I18nLang() lang?: string
  ): Promise<IHttpResponse> {
    return this.accountService.verify(token, email, lang);
  }

  @Get('status')
  @ApiOperation({ summary: 'Get account status' })
  @ApiResponse({ status: 200, description: 'Account status', type: IAccountStatusHttpResponse })
  async status(
    @Query('email') email: string,
    @I18nLang() lang?: string
  ): Promise<IAccountStatusHttpResponse> {
    return this.accountService.status(email, lang);
  }
}