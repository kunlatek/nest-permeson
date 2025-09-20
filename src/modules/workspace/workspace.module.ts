import { Module } from "@nestjs/common";
import { WorkspaceService } from "./workspace.service";
import { ProfileModule } from "../profile/profile.module";
import { WorkspaceController } from "./workspace.controller";

import { DatabaseEnum } from "src/enums/database.enum";
import { DATABASE } from "src/common/constants/database.constant";
import { getDatabaseModule } from "src/utils/database.utils";
import { WorkspaceMongodbModule } from "./repositories/mongodb/workspace.mongodb.module";
import { WorkspaceSQLModule } from "./repositories/sql";

import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    getDatabaseModule(DATABASE, [
      { database: DatabaseEnum.MONGODB, module: WorkspaceMongodbModule },
      { database: DatabaseEnum.POSTGRES, module: WorkspaceSQLModule },
      { database: DatabaseEnum.SQLITE, module: WorkspaceSQLModule },
    ]),

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
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
  exports: [WorkspaceService],
})
export class WorkspaceModule { }