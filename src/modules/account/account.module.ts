import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { ProfileModule } from '../profile/profile.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonModule } from '../../common/common.module';
import { EmailService } from './services/email.service';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { WorkspaceModule } from '../workspace/workspace.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const jwtSecret = configService.get<string>('JWT_SECRET');

        if (!jwtSecret) {
          throw new Error(
            '❌ CRITICAL FAILURE: JWT_SECRET is not defined in .env!',
          );
        }

        return {
          secret: jwtSecret,
          signOptions: { expiresIn: '7d' },
        };
      },
    }),
    CommonModule,
    UserModule,
    ProfileModule,
    WorkspaceModule,
  ],
  providers: [AccountService, EmailService],
  controllers: [AccountController],
  exports: [AccountService],
})
export class AccountModule {}
