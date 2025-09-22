import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { SignupDto, ResetPasswordDto, LoginDto } from "./dto";
import { EmailService } from "./services/email.service";
import { UserResponseDto } from "../user/dto/user-response.dto";
import { I18nService } from "nestjs-i18n";
import { AuthLoginResponseDto } from "./dto/auth-response.dto";
import { ILoginHttpResponse } from "./interfaces/login-http-response.interface";
import { IResetPasswordHttpResponse } from "./interfaces/reset-pass-http-response.interface";
import { IHttpResponse } from "src/interfaces";
import { WorkspaceService } from "../workspace/workspace.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly i18n: I18nService,
    private readonly workspaceService: WorkspaceService,
  ) { }

  async validateUser(email: string, password: string, lang: string = "en"): Promise<UserResponseDto> {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new NotFoundException(this.i18n.t("translation.auth.user-not-found", { lang }));

    if (!user.password) {
      throw new UnauthorizedException(this.i18n.t("translation.auth.invalid-credentials", { lang }));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException(this.i18n.t("translation.auth.invalid-credentials", { lang }));

    if (!user.verified) throw new UnauthorizedException(this.i18n.t("translation.auth.account-not-verified", { lang }));

    return user;
  }

  async signup(signupDto: SignupDto, lang: string = "en"): Promise<IHttpResponse> {
    if (await this.userService.findByEmail(signupDto.email)) {
      throw new BadRequestException(this.i18n.t("translation.auth.signup.email-already-in-use", { lang }));
    }

    try {
      const { email, password } = signupDto;
      await this.userService.createUser({ email, password });
      await this.emailService.sendRegisterEmail(email);
      return new IHttpResponse(200, this.i18n.t("translation.auth.signup.success", { lang }));
    } catch (error) {
      throw new BadRequestException(this.i18n.t("translation.auth.signup.error", { lang }));
    }
  }

  async login(loginDto: LoginDto, lang: string = "en"): Promise<ILoginHttpResponse> {
    const { email, password } = loginDto;
    const user = await this.validateUser(email, password, lang);
    const { _id: sub } = user;
    const workspaceId = await this.workspaceService.findWorkspacesByOwner(sub, lang);
    return new ILoginHttpResponse(200, this.i18n.t("translation.auth.login.success", { lang }), new AuthLoginResponseDto(this.jwtService.sign({ sub, email, workspaceId: workspaceId.data._id })));
  }

  async resetPasswordRequest(email: string, lang: string = "en"): Promise<IResetPasswordHttpResponse> {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new NotFoundException(this.i18n.t("translation.auth.user-not-found", { lang }));

    try {
      await this.emailService.sendResetPasswordEmail(email);
    } catch (error) {
      throw new BadRequestException(this.i18n.t("translation.auth.reset-password-request.error", { lang }));
    }

    return new IResetPasswordHttpResponse(200, this.i18n.t("translation.auth.reset-password-request.success", { lang }), this.i18n.t("translation.auth.reset-password-request.success", { lang }));
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto, lang: string = "en"): Promise<IResetPasswordHttpResponse> {
    const { token, password } = resetPasswordDto;

    let payload: any;

    try {
      payload = this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException(this.i18n.t("translation.auth.invalid-token", { lang }));
    }

    const user = await this.userService.findByEmail(payload.email);
    if (!user) throw new NotFoundException(this.i18n.t("translation.auth.user-not-found", { lang }));

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userService.updateUser(user._id, { password: hashedPassword });

    return new IResetPasswordHttpResponse(200, this.i18n.t("translation.auth.reset-password.success", { lang }), this.i18n.t("translation.auth.reset-password.success", { lang }));
  }

  /*async googleLogin(idToken: string) {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v1/tokeninfo?id_token=${idToken}`
      );

      const { email, sub: providerId, picture } = response.data;

      if (!email || !providerId) {
        throw new UnauthorizedException(
          this.errorService.getErrorMessage(ErrorCodeEnum.UNAUTHORIZED)
        );
      }

      let user = await this.userService.findByEmail(email);

      if (!user) {
        user = await this.userService.createWithProvider({
          email,
          provider: "google",
          providerId,
          profilePicture: picture,
        });
      }

      return this.login(user);
    } catch (error) {
      console.error("❌ Failed to validate Google ID token:", error.message);

      throw new UnauthorizedException(
        this.errorService.getErrorMessage(ErrorCodeEnum.INVALID_CREDENTIALS)
      );
    }
  }

  async appleLogin(idToken: string) {
    try {
      const decoded: any = jwt.decode(idToken, { complete: true });
      const kid = decoded?.header?.kid;

      if (!kid) {
        throw new UnauthorizedException(
          this.errorService.getErrorMessage(ErrorCodeEnum.INVALID_CREDENTIALS)
        );
      }

      const client = jwksClient({
        jwksUri: "https://appleid.apple.com/auth/keys",
      });

      const key = await client.getSigningKey(kid);
      const publicKey = key.getPublicKey();

      const payload: any = jwt.verify(idToken, publicKey, {
        algorithms: ["RS256"],
      });

      const { email, sub: providerId } = payload;

      if (!email || !providerId) {
        throw new UnauthorizedException(
          this.errorService.getErrorMessage(ErrorCodeEnum.UNAUTHORIZED)
        );
      }

      let user = await this.userService.findByEmail(email);

      if (!user) {
        user = await this.userService.createWithProvider({
          email,
          provider: "apple",
          providerId,
        });
      }

      return this.login(user);
    } catch (error) {
      console.error("❌ Failed to validate Apple ID token:", error.message);

      throw new UnauthorizedException(
        this.errorService.getErrorMessage(ErrorCodeEnum.INVALID_CREDENTIALS)
      );
    }
  }*/
}
