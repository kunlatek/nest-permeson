import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { WorkspaceSchema, MongoDBWorkspace, WorkspaceMongoDBRepository } from '.';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MongoDBWorkspace.name, schema: WorkspaceSchema },
    ])
  ],
  providers: [
    {
      provide: 'WorkspaceRepository',
      useClass: WorkspaceMongoDBRepository,
    },
  ],
  exports: ['WorkspaceRepository'],
})
export class WorkspaceMongodbModule { }
