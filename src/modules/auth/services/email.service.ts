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

  async sendRegisterEmail(email: string) {
    const baseUrl = this.configService.get("API_BASE_URL");

    const token = this.jwtService.sign({ email }, { expiresIn: "24h" });

    const url = `${baseUrl}/account/verify?token=${token}&email=${email}`;

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Bem vindo",
      html: `
        <h1>Bem vindo!</h1>
        <p>Clique no link abaixo para verificar seu email:</p>
        <a href="${url}">Verificar email</a>
        <p>Este link expira em 24 horas.</p>
      `,
    });

    return {
      message: "Email de registro enviado com sucesso",
    };
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
}
