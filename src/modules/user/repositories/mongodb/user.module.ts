import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { CommonModule } from 'src/common/common.module';

import { UserService } from '../../user.service';
import { MongoDBUser, UserSchema, UserMongoDBRepository } from '.'; 

import { DATABASE } from 'src/common/constants/database.constant';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MongoDBUser.name, schema: UserSchema }
    ]),
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
  controllers: [],
  providers: [
    UserService,
    {
      provide: 'UserRepository',
      useClass: UserMongoDBRepository,
    },
  ],
  exports: [UserService],
})
export class UserModule {} 