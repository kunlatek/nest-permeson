import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class EmailPassStrategy extends PassportStrategy(Strategy, 'email') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string, i18n?: string): Promise<any> {
    return await this.authService.validateUser(email, password, i18n);
  }
}
