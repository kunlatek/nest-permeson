import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from 'src/common/common.module';

import { PersonProfileSchema, MongoDBPersonProfile, PersonProfileMongoDBRepository } from '.';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MongoDBPersonProfile.name, schema: PersonProfileSchema },
    ]),
    CommonModule,
  ],
  providers: [
    {
      provide: 'PersonProfileRepository',
      useClass: PersonProfileMongoDBRepository,
    },
  ],
  exports: ['PersonProfileRepository'],
})
export class PersonProfileModule {}
