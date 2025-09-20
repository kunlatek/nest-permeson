import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Company Profile Entities
import { 
  CompanyProfileEntity, 
} from './company-profile.entity';

// Company Profile SQL Repository
import { CompanyProfileSQLRepository } from './company-profile.sql.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CompanyProfileEntity,
    ]),
  ],
  providers: [
    {
      provide: 'CompanyProfileRepository',
      useClass: CompanyProfileSQLRepository,
    },
  ],
  exports: ['CompanyProfileRepository'],
})
export class CompanyProfileSQLModule {} 