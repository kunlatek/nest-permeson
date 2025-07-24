import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./modules/auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ProfileModule } from "./modules/profile/profile.module";
import { CommonModule } from "./common/common.module";
import { LoggingModule } from "./common/logging/logging.module";
import { RequestLoggerModule } from "./common/middleware/request-logger.module";
import { OwnerModule } from "./common/interceptors/owner.module";
import { AccountModule } from "./modules/account/account.module";
import { WorkspaceModule } from "./modules/workspace/workspace.module";
import { I18nModule, AcceptLanguageResolver, QueryResolver } from "nestjs-i18n";

import * as path from "path";

import { DATABASE } from "./common/constants/database.constant";

@Module({
  imports: [
    // RAPIDA-V-MODULE-IMPORT-PLACEHOLDER
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    I18nModule.forRoot({
      fallbackLanguage: "en",
      loaderOptions: {
        path: path.join(__dirname, "/i18n/"),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ["lang"] },
        AcceptLanguageResolver,
      ],
    }),
    AuthModule,
    AccountModule,
    ProfileModule,
    ...WorkspaceModule(DATABASE),
    
    CommonModule,
    LoggingModule,
    RequestLoggerModule,
    OwnerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {}
}
