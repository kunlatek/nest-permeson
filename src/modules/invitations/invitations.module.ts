import { Module, NestModule, MiddlewareConsumer, RequestMethod, forwardRef } from "@nestjs/common";
import { DatabaseEnum } from "src/enums/database.enum";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { getDatabaseModule } from "src/utils/database.utils";
import { DATABASE } from "src/common/constants/database.constant";
import { InvitationsSQLModule } from "./repositories/sql";
import { InvitationsMongoDBModule } from "./repositories/mongodb";

import { InvitationsService } from "./invitations.service";
import { InvitationsController } from "./invitations.controller";

import { WorkspaceModule } from "../workspace/workspace.module";
import { UserModule } from "../user/user.module";
import { AuthModule } from "../auth/auth.module";
import { AclModule } from "src/common/middleware/acl.module";
import { AclMiddleware } from "src/common/middleware/acl.middleware";

@Module({
  imports: [
    getDatabaseModule(DATABASE, [
      { database: DatabaseEnum.MONGODB, module: InvitationsMongoDBModule },
      { database: DatabaseEnum.SQLITE, module: InvitationsSQLModule },
      { database: DatabaseEnum.POSTGRES, module: InvitationsSQLModule },
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

    WorkspaceModule,
    UserModule,
    forwardRef(() => AuthModule),
    AclModule,
  ],
  controllers: [InvitationsController],
  providers: [InvitationsService],
  exports: [InvitationsService],
})
export class InvitationsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AclMiddleware)
      .forRoutes({ path: 'invitations*', method: RequestMethod.ALL });
  }
}

