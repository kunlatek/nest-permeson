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
import { ProfileService } from "../profile/profile.service";
import { InvitationsService } from "../invitations/invitations.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly i18n: I18nService,
    private readonly workspaceService: WorkspaceService,
    private readonly profileService: ProfileService,
    private readonly invitationsService: InvitationsService,
  ) { }

  async validateUser(email: string, password: string, lang: string = "en"): Promise<UserResponseDto> {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new NotFoundException(this.i18n.t("translation.auth.user-not-found", { lang }));

    if (!user.password) {
      throw new UnauthorizedException(this.i18n.t("translation.auth.invalid-credentials", { lang }));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException(this.i18n.t("translation.auth.invalid-credentials", { lang }));

    return user;
  }

  async signup(signupDto: SignupDto, lang: string = "en"): Promise<ILoginHttpResponse> {
    const { email, password, token } = signupDto;

    if (await this.userService.findByEmail(email)) {
      throw new BadRequestException(this.i18n.t("translation.auth.signup.email-already-in-use", { lang }));
    }

    let payload: any;
    try {
      payload = this.jwtService.verify(token);
    } catch (error) {
      throw new BadRequestException(this.i18n.t("translation.auth.invalid-token", { lang }));
    }

    if (payload.email !== email) {
      throw new BadRequestException(this.i18n.t("translation.auth.signup.email-and-token-dont-match", { lang }));
    }

    // Extrai workspaceId do token (token de convite)
    const { workspaceId } = payload;

    try {
      // Cria o usuário
      const user = await this.userService.createUser({ email, password });
      const { _id: sub } = user;
      
      // Se o token tem workspaceId (convite), adiciona usuário ao workspace existente
      if (workspaceId) {
        // Busca workspace para obter o owner
        const workspace = await this.workspaceService.findWorkspaceById(workspaceId, lang);
        
        // Adiciona ao team do workspace
        await this.workspaceService.addTeamUser(workspace.data.owner, sub, lang);
        
        // Cria perfis do usuário
        await this.profileService.createProfiles(user._id, email.split('@')[0], lang);
        
        // Marca o convite como aceito
        try {
          const invitations = await this.invitationsService.findAll(workspaceId, lang, undefined, undefined, email, false);
          if (invitations.data && invitations.data.length > 0) {
            const invitation: any = invitations.data[0];
            await this.invitationsService.update(invitation._id, { accepted: true }, workspaceId, sub, lang);
          }
        } catch (error) {
          console.error('Error updating invitation status:', error);
          // Não falha o signup se não conseguir marcar o convite
        }
        
        return new ILoginHttpResponse(
          200, 
          this.i18n.t("translation.auth.signup.success", { lang }), 
          new AuthLoginResponseDto(this.jwtService.sign({ sub, email, workspaceId }))
        );
      } else {
        // Fluxo antigo: cria novo workspace (caso não tenha workspaceId no token)
        const workspace = await this.workspaceService.createWorkspace({ owner: sub, team: [sub] }, lang);
        await this.profileService.createProfiles(user._id, email.split('@')[0], lang);
        
        return new ILoginHttpResponse(
          200, 
          this.i18n.t("translation.auth.signup.success", { lang }), 
          new AuthLoginResponseDto(this.jwtService.sign({ sub, email, workspaceId: workspace._id }))
        );
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Signup error:', error);
      throw new BadRequestException(this.i18n.t("translation.auth.signup.error", { lang }));
    }
  }

  async login(loginDto: LoginDto, lang: string = "en"): Promise<ILoginHttpResponse> {
    const { email, password } = loginDto;
    const user = await this.validateUser(email, password, lang);
    const { _id: sub } = user;
    
    // Tenta buscar workspace do owner primeiro
    const workspaceResponse = await this.workspaceService.findWorkspacesByOwner(sub, lang);
    let workspaceId: string;
    
    // Se não é owner, busca pelos workspaces onde é membro do team
    if (!workspaceResponse.data || !workspaceResponse.data._id) {
      const myWorkspaces = await this.workspaceService.getMyWorkspaces(sub, lang);
      if (myWorkspaces.data && myWorkspaces.data.length > 0) {
        // Usa o primeiro workspace da lista
        workspaceId = myWorkspaces.data[0]._id;
      } else {
        throw new NotFoundException(this.i18n.t("translation.workspace.workspace-not-found", { lang }));
      }
    } else {
      workspaceId = workspaceResponse.data._id;
    }
    
    return new ILoginHttpResponse(200, this.i18n.t("translation.auth.login.success", { lang }), new AuthLoginResponseDto(this.jwtService.sign({ sub, email, workspaceId })));
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

  async deleteAccount(userId: string, lang: string = "en"): Promise<IHttpResponse> {
    try {
      await this.userService.softDeleteUser(userId);
      return new IHttpResponse(200, this.i18n.t("translation.auth.account-deleted", { lang }));
    } catch (error) {
      throw new BadRequestException(this.i18n.t("translation.auth.error-deleting-account", { lang }));
    }
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
