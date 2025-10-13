import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AclMiddleware } from './acl.middleware';
import { WorkspaceModule } from 'src/modules/workspace/workspace.module';
import { RolesModule } from 'src/modules/roles/roles.module';

/**
 * Module for ACL Middleware
 * Provides ACL middleware with necessary dependencies
 * 
 * This module is marked as Global to ensure that the AclMiddleware
 * can be used in any module without needing to explicitly import dependencies
 */
@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
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
          signOptions: { expiresIn: '7d' },
        };
      },
    }),
    WorkspaceModule,
    RolesModule,
  ],
  providers: [AclMiddleware],
  exports: [AclMiddleware, WorkspaceModule, RolesModule],
})
export class AclModule {}

