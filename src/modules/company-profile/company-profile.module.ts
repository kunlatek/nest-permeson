import { Module } from "@nestjs/common";
import { DatabaseEnum } from "src/enums/database.enum";

import { DATABASE } from "src/common/constants/database.constant";
import { CompanyProfileMongodbModule } from "./repositories/mongodb/company-profile.mongodb.module";

import { CompanyProfileService } from "./company-profile.service";

import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        DATABASE === DatabaseEnum.MONGODB ? CompanyProfileMongodbModule : null,

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