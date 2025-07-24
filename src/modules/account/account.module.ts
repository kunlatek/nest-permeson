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
import { WorkspaceService } from '../workspace/workspace.service';

import { DATABASE } from 'src/common/constants/database.constant';

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
    ...WorkspaceModule(DATABASE),
  ],
  providers: [AccountService, EmailService, WorkspaceService],
  controllers: [AccountController],
  exports: [],
})
export class AccountModule {}
