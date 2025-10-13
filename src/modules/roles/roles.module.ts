import { Module, forwardRef, NestModule, MiddlewareConsumer, RequestMethod } from "@nestjs/common";
import { DatabaseEnum } from "src/enums/database.enum";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { getDatabaseModule } from "src/utils/database.utils";
import { DATABASE } from "src/common/constants/database.constant";
import { RolesSQLModule } from "./repositories/sql";
import { RolesMongoDBModule } from "./repositories/mongodb";

import { RolesService } from "./roles.service";
import { RolesController } from "./roles.controller";

import { WorkspaceModule } from "../workspace/workspace.module";
import { AclMiddleware } from "src/common/middleware/acl.middleware";

@Module({
  imports: [
    getDatabaseModule(DATABASE, [
      { database: DatabaseEnum.MONGODB, module: RolesMongoDBModule },
      { database: DatabaseEnum.SQLITE, module: RolesSQLModule },
      { database: DatabaseEnum.POSTGRES, module: RolesSQLModule },
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

    forwardRef(() => WorkspaceModule),
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AclMiddleware)
      .forRoutes({ path: 'roles*', method: RequestMethod.ALL });
  }
}

