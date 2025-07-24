import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PersonProfileSchema, MongoDBPersonProfile, PersonProfileMongoDBRepository } from '.';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MongoDBPersonProfile.name, schema: PersonProfileSchema },
    ]),
  ],
  providers: [
    {
      provide: 'PersonProfileRepository',
      useClass: PersonProfileMongoDBRepository,
    },
  ],
  exports: ['PersonProfileRepository'],
})
export class PersonProfileMongodbModule {}
