import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { AccountStatusDto } from "./dto";
import { I18nService } from "nestjs-i18n";

import { JwtService } from "@nestjs/jwt";
import { EmailService } from "./services/email.service";
import { UserService } from "../user/user.service";
import { ProfileService } from "../profile/profile.service";
import { WorkspaceService } from "../workspace/workspace.service";
import { IAccountStatusHttpResponse } from "./interfaces/account-http-response.interface";
import { IHttpResponse } from "src/interfaces/http-response.interface";

@Injectable()
export class AccountService {
  constructor(
    private readonly emailService: EmailService,
    private readonly i18n: I18nService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly profileService: ProfileService,
    private readonly workspaceService: WorkspaceService,
  ) { }

  async sendVerifyEmail(email: string, lang: string): Promise<IHttpResponse> {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new NotFoundException(this.i18n.t("translation.auth.user-not-found", { lang }));
    await this.emailService.sendVerifyEmail(email);
    return new IHttpResponse(204, this.i18n.t("translation.account.verify-email-sent", { lang }));
  }

  async verify(token: string, email: string, lang: string): Promise<IHttpResponse> {
    let payload: any;
    try {
      payload = await this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException(this.i18n.t("translation.auth.invalid-token", { lang }));
    }

    if (payload.email !== email) {
      throw new BadRequestException(this.i18n.t("translation.account.email-and-token-dont-match", { lang }));
    }

    const user = await this.userService.findByEmail(email);
    if (!user) throw new NotFoundException(this.i18n.t("translation.auth.user-not-found", { lang }));

    try {
      await this.userService.updateUser(user._id, { verified: true });
    } catch (error) {
      console.error(error);
    }

    try {
      await this.profileService.createProfiles(user._id, email.split('@')[0], lang);
    } catch (error) {
      console.error(error);
    }

    try {
      await this.workspaceService.createWorkspace({ owner: user._id, team: [user._id] }, lang);
    } catch (error) {
      console.error(error);
    }


    return new IHttpResponse(204, this.i18n.t("translation.account.verified", { lang }));
  }

  async status(email: string, lang: string): Promise<IAccountStatusHttpResponse> {
    try {
      let response = { exists: false, verified: false };
      const user = await this.userService.findByEmail(email);
      if (!user) return new IAccountStatusHttpResponse(200, this.i18n.t("translation.account.account-status", { lang }), new AccountStatusDto(response));

      response.exists = true;
      response.verified = user.verified;

      return new IAccountStatusHttpResponse(200, this.i18n.t("translation.account.account-status", { lang }), new AccountStatusDto(response));
    } catch (error) {
      throw new BadRequestException(this.i18n.t("translation.account.error-getting-user", { lang }));
    }
  }
}