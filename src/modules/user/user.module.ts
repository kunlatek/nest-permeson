import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseEnum } from 'src/enums/database.enum';

import { CommonModule } from 'src/common/common.module';

import { getDatabaseModule } from 'src/utils/database.utils';
import { DATABASE } from 'src/common/constants/database.constant';
import { UserMongoDBModule } from './repositories/mongodb/user.mongodb.module';
import { UserSQLModule } from './repositories/sql';

import { UserService } from './user.service';

@Module({
  imports: [
    getDatabaseModule(DATABASE, [
      { database: DatabaseEnum.MONGODB, module: UserMongoDBModule },
      { database: DatabaseEnum.POSTGRES, module: UserSQLModule },
      { database: DatabaseEnum.SQLITE, module: UserSQLModule },
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
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {} 