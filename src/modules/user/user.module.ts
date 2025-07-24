import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseEnum } from 'src/enums/database.enum';

import { CommonModule } from 'src/common/common.module';

import { UserMongoDBModule } from './repositories/mongodb/user-mongodb.module';

import { UserService } from './user.service';

import { DATABASE } from 'src/common/constants/database.constant';

@Module({
  imports: [
    DATABASE === DatabaseEnum.MONGODB ? UserMongoDBModule : null,

    CommonModule,
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
          signOptions: { expiresIn: '24h' },
        };
      },
    }),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {} 