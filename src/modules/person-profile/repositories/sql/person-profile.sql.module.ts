import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PersonProfileEntity } from "./person-profile.entity";
import { PersonJobEntity } from "./person-profile.entity";
import { PersonEducationEntity } from "./person-profile.entity";
import { PersonCourseEntity } from "./person-profile.entity";
import { PersonBankDataEntity } from "./person-profile.entity";
import { PersonRelatedFileEntity } from "./person-profile.entity";
import { PersonProfileSQLRepository } from "./person-profile.sql.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PersonProfileEntity, 
      PersonJobEntity, 
      PersonEducationEntity, 
      PersonCourseEntity, 
      PersonBankDataEntity, 
      PersonRelatedFileEntity
    ])
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