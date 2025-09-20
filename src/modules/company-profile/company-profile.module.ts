import { Module } from "@nestjs/common";
import { DatabaseEnum } from "src/enums/database.enum";

import { getDatabaseModule } from "src/utils/database.utils";
import { DATABASE } from "src/common/constants/database.constant";
import { CompanyProfileMongodbModule } from "./repositories/mongodb/company-profile.mongodb.module";
import { CompanyProfileSQLModule } from "./repositories/sql/company-profile.sql.module";

import { CompanyProfileService } from "./company-profile.service";

import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        getDatabaseModule(DATABASE, [
            { database: DatabaseEnum.MONGODB, module: CompanyProfileMongodbModule },
            { database: DatabaseEnum.POSTGRES, module: CompanyProfileSQLModule },
            { database: DatabaseEnum.SQLITE, module: CompanyProfileSQLModule },
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
    ],
    providers: [CompanyProfileService],
    exports: [CompanyProfileService],
})
export class CompanyProfileModule {}