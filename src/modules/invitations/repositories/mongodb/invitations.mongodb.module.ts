import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MongoDBInvitation, InvitationSchema } from './invitation.schema';
import { InvitationsMongoDBRepository } from './invitations.mongodb.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MongoDBInvitation.name, schema: InvitationSchema }
    ]),
  ],
  providers: [
    {
      provide: 'InvitationsRepository',
      useClass: InvitationsMongoDBRepository,
    },
  ],
  exports: ['InvitationsRepository'],
})
export class InvitationsMongoDBModule {}

