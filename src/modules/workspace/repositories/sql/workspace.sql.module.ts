import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Workspace Entities
import { WorkspaceEntity } from './workspace.entity';

// Workspace SQL Repository
import { WorkspaceSQLRepository } from './workspace.sql.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WorkspaceEntity
    ]),
  ],
  providers: [
    {
      provide: 'WorkspaceRepository',
      useClass: WorkspaceSQLRepository,
    },
  ],
  exports: ['WorkspaceRepository'],
})
export class WorkspaceSQLModule {} 