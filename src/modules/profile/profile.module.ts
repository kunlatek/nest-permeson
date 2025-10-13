import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ProfileService } from './profile.service';
import { CompanyProfileModule } from '../company-profile/company-profile.module';
import { PersonProfileModule } from '../person-profile/person-profile.module';
import { ProfileController } from './profile.controller';
import { AclMiddleware } from 'src/common/middleware/acl.middleware';

@Module({
  imports: [
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
    CompanyProfileModule,
    PersonProfileModule,
  ],
  providers: [
    ProfileService,
  ],
  controllers: [ProfileController],
  exports: [ProfileService],
})
export class ProfileModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AclMiddleware)
      .forRoutes({ path: 'profiles*', method: RequestMethod.ALL });
  }
}
