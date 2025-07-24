import { Module } from "@nestjs/common";
import { WorkspaceMongodbModule } from "./repositories/mongodb/workspace.mongodb.module";
import { WorkspaceService } from "./workspace.service";
import { ProfileModule } from "../profile/profile.module";

import { DatabaseEnum } from "src/enums/database.enum";
import { DATABASE } from "src/common/constants/database.constant";

import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    DATABASE === DatabaseEnum.MONGODB ? WorkspaceMongodbModule : null,

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
    ProfileModule
  ],
  providers: [WorkspaceService],
  exports: [WorkspaceService],
})
export class WorkspaceModule { }