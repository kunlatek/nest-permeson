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

  async sendPreSignupEmail(email: string, token: string) {
    const frontendUrl = this.configService.get("BASE_URL");
    
    const url = `${frontendUrl}/auth/register?email=${encodeURIComponent(email)}&token=${token}`;

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Finalize seu cadastro",
      html: `
        <h1>Bem-vindo!</h1>
        <p>Para finalizar seu cadastro, clique no link abaixo:</p>
        <a href="${url}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Finalizar Cadastro</a>
        <p>Este link expira em 24 horas.</p>
        <p>Se você não solicitou este cadastro, pode ignorar este email.</p>
      `,
    });

    return {
      message: "Email de pre-cadastro enviado com sucesso",
    };
  }
}
