import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from 'src/common/common.module';

import { CompanyProfileController } from '../../company-profile.controller';
import { CompanyProfileService } from '../../company-profile.service';
import { MongoDBCompanyProfile, CompanyProfileSchema, CompanyProfileMongoDBRepository } from '.';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MongoDBCompanyProfile.name, schema: CompanyProfileSchema },
    ]),
    CommonModule,
  ],
  controllers: [CompanyProfileController],
  providers: [
    CompanyProfileService,
    {
      provide: 'CompanyProfileRepository',
      useClass: CompanyProfileMongoDBRepository,
    },
  ],
  exports: [CompanyProfileService],
})
export class CompanyProfileModule {}
