import { Module } from "@nestjs/common";
import { DatabaseEnum } from "src/enums/database.enum";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { getDatabaseModule } from "src/utils/database.utils";
import { DATABASE } from "src/common/constants/database.constant";
import { PersonProfileMongodbModule } from "./repositories/mongodb/person-profile.mongodb.module";
import { PersonProfileSQLModule } from "./repositories/sql/person-profile.sql.module";

import { PersonProfileService } from "./person-profile.service";

@Module({
    imports: [
        getDatabaseModule(DATABASE, [
            { database: DatabaseEnum.MONGODB, module: PersonProfileMongodbModule },
            { database: DatabaseEnum.POSTGRES, module: PersonProfileSQLModule },
            { database: DatabaseEnum.SQLITE, module: PersonProfileSQLModule },
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
    providers: [PersonProfileService],
    exports: [PersonProfileService],
})
export class PersonProfileModule { }