import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./modules/auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { ProfileModule } from "./modules/profile/profile.module";
import { CommonModule } from "./common/common.module";
import { LoggingModule } from "./common/logging/logging.module";
import { RequestLoggerModule } from "./common/middleware/request-logger.module";
import { OwnerModule } from "./common/interceptors/owner.module";
import { AccountModule } from "./modules/account/account.module";
import { WorkspaceModule } from "./modules/workspace/workspace.module";
import { PostsModule } from "./modules/posts/posts.module";
import { I18nModule, AcceptLanguageResolver, QueryResolver } from "nestjs-i18n";

// SQL Modules
import { PersonProfileSQLModule } from "./modules/person-profile/repositories/sql/person-profile.sql.module";
import { CompanyProfileSQLModule } from "./modules/company-profile/repositories/sql/company-profile.sql.module";
import { UserSQLModule } from "./modules/user/repositories/sql/user.sql.module";
import { WorkspaceSQLModule } from "./modules/workspace/repositories/sql/workspace.sql.module";
import { PostsSQLModule } from "./modules/posts/repositories/sql/posts.sql.module";

import { DATABASE } from "./common/constants/database.constant";
import { getDatabaseConfig } from "./utils/database.utils";

import * as path from "path";

@Module({
  imports: [
    // RAPIDA-V-MODULE-IMPORT-PLACEHOLDER
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    getDatabaseConfig(DATABASE),
    
    // SQL Modules
    PersonProfileSQLModule,
    CompanyProfileSQLModule,
    UserSQLModule,
    WorkspaceSQLModule,
    PostsSQLModule,
    
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
    WorkspaceModule,
    PostsModule,
    
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
