import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { CommonModule } from 'src/common/common.module';

import { InvitationController } from '../../invitation.controller';
import { InvitationService } from '../../invitation.service';
import { EmailService } from '../../services/email.service';
import { MongoDBInvitation, InvitationSchema, InvitationMongoDBRepository } from '.';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MongoDBInvitation.name, schema: InvitationSchema }
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
  controllers: [InvitationController],
  providers: [
    InvitationService,
    EmailService,
    {
      provide: 'InvitationRepository',
      useClass: InvitationMongoDBRepository,
    },
  ],
  exports: [InvitationService],
})
export class InvitationModule {} 