import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Person Profile Entities
import { 
  PersonProfileEntity, 
} from './person-profile.entity';

// Person Profile SQL Repository
import { PersonProfileSQLRepository } from './person-profile.sql.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PersonProfileEntity,
    ]),
  ],
  providers: [
    {
      provide: 'PersonProfileRepository',
      useClass: PersonProfileSQLRepository,
    },
  ],
  exports: ['PersonProfileRepository'],
})
export class PersonProfileSQLModule {} 