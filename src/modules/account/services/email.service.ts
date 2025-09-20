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

  async sendVerifyEmail(email: string) {
    const baseUrl = this.configService.get("API_BASE_URL");

    const token = this.jwtService.sign({ email }, { expiresIn: "24h" });

    const url = `${baseUrl}/account/verify?token=${token}&email=${email}`;

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Verifique seu email",
      html: `
        <h1>Bem-vindo!</h1>
        <p>Clique no link abaixo para verificar seu email:</p>
        <a href="${url}">Verificar email</a>
        <p>Este link expira em 24 horas.</p>
      `,
    });

    return {
      message: "Email de verificação enviado com sucesso",
    };
  }
}
