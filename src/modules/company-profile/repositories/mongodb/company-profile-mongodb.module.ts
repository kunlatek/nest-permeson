import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoDBCompanyProfile, CompanyProfileSchema, CompanyProfileMongoDBRepository } from '.';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MongoDBCompanyProfile.name, schema: CompanyProfileSchema },
    ]),
  ],
  providers: [
    {
      provide: 'CompanyProfileRepository',
      useClass: CompanyProfileMongoDBRepository,
    },
  ],
  exports: ['CompanyProfileRepository'],
})
export class CompanyProfileMongodbModule {}
