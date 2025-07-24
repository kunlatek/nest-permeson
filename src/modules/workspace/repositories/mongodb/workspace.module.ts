import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from 'src/common/common.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { WorkspaceService } from '../../workspace.service';
import { ProfileModule } from 'src/modules/profile/profile.module';

import { WorkspaceSchema, MongoDBWorkspace, WorkspaceMongoDBRepository } from '.';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MongoDBWorkspace.name, schema: WorkspaceSchema },
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
          signOptions: { expiresIn: '7d' },
        };
      },
    }),
    CommonModule,
    ProfileModule,
  ],
  providers: [
    {
      provide: 'WorkspaceRepository',
      useClass: WorkspaceMongoDBRepository,
    },
    WorkspaceService,
  ],
  exports: ['WorkspaceRepository'],
})
export class WorkspaceModule { }
