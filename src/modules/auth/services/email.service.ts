import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as nodemailer from "nodemailer";

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }


  async sendResetPasswordEmail(email: string) {
    const baseUrl = this.configService.get("BASE_URL");

    const token = this.jwtService.sign({ email }, { expiresIn: "1h" });

    const url = `${baseUrl}/auth/reset-password/${token}`;

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Recuperação de senha",
      text: `Clique no link abaixo para resetar sua senha: ${url}`,
    });

    return {
      message: "Email de recuperação de senha enviado com sucesso",
    };
  }

  async sendAccountDeletionWarning(email: string, daysRemaining: number) {
    const frontendUrl = this.configService.get("BASE_URL");
    
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Aviso: Sua conta será deletada em breve",
      html: `
        <h1>Aviso Importante</h1>
        <p>Sua conta está agendada para ser deletada permanentemente.</p>
        <p><strong>Tempo restante: ${daysRemaining} dias</strong></p>
        <p>Se você deseja manter sua conta ativa, por favor faça login antes do prazo final.</p>
        <a href="${frontendUrl}/auth/login" style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reativar Minha Conta</a>
        <p>Após a deleção permanente, todos os seus dados serão removidos e não poderão ser recuperados.</p>
      `,
    });

    return {
      message: "Email de aviso de deleção enviado com sucesso",
    };
  }

  async sendInvitationEmail(email: string, token: string, workspaceId: string, roleId: string) {
    const frontendUrl = this.configService.get("BASE_URL");
    
    const url = `${frontendUrl}/auth/register?email=${encodeURIComponent(email)}&token=${token}`;

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Você foi convidado para participar de um workspace",
      html: `
        <h1>Convite para Workspace</h1>
        <p>Você foi convidado para fazer parte de um workspace!</p>
        <p>Para aceitar o convite e criar sua conta, clique no link abaixo:</p>
        <a href="${url}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Aceitar Convite</a>
        <p>Este link expira em 7 dias.</p>
        <p>Se você não esperava este convite, pode ignorar este email.</p>
      `,
    });

    return {
      message: "Email de convite enviado com sucesso",
    };
  }

  async sendAdminInvitationEmail(email: string, token: string) {
    const frontendUrl = this.configService.get("BASE_URL");
    
    const url = `${frontendUrl}/auth/register?email=${encodeURIComponent(email)}&token=${token}`;

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Convite para cadastro na plataforma",
      html: `
        <h1>Bem-vindo!</h1>
        <p>Você foi convidado para criar uma conta na nossa plataforma!</p>
        <p>Para finalizar seu cadastro, clique no link abaixo:</p>
        <a href="${url}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Criar Conta</a>
        <p>Este link expira em 7 dias.</p>
        <p>Se você não solicitou este convite, pode ignorar este email.</p>
      `,
    });

    return {
      message: "Email de convite admin enviado com sucesso",
    };
  }
}
