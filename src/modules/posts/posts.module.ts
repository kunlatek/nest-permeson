import { Module } from "@nestjs/common";
import { DatabaseEnum } from "src/enums/database.enum";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { getDatabaseModule } from "src/utils/database.utils";
import { DATABASE } from "src/common/constants/database.constant";
import { PostsSQLModule } from "./repositories/sql";
import { PostsMongoDBModule } from "./repositories/mongodb";

import { PostsService } from "./posts.service";
import { PostsController } from "./posts.controller";

import { WorkspaceModule } from "../workspace/workspace.module";

@Module({
  imports: [
    getDatabaseModule(DATABASE, [
      { database: DatabaseEnum.MONGODB, module: PostsMongoDBModule },
      { database: DatabaseEnum.SQLITE, module: PostsSQLModule },
      { database: DatabaseEnum.POSTGRES, module: PostsSQLModule },
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
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
