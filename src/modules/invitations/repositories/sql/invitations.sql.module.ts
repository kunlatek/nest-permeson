import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InvitationEntity } from './invitation.entity';
import { InvitationsSQLRepository } from './invitations.sql.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InvitationEntity
    ]),
  ],
  providers: [
    {
      provide: 'InvitationsRepository',
      useClass: InvitationsSQLRepository,
    },
  ],
  exports: ['InvitationsRepository'],
})
export class InvitationsSQLModule {}

