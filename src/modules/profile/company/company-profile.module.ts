import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyProfileController } from './company-profile.controller';
import { CompanyProfileService } from './company-profile.service';
import { CompanyProfileMongoDBRepository } from './repositories/mongodb/company-profile.mongodb.repository';
import { MongoDBCompanyProfile, CompanyProfileSchema } from './repositories/mongodb/company-profile.schema';
import { CommonModule } from '../../../common/common.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MongoDBCompanyProfile.name, schema: CompanyProfileSchema },
    ]),
    CommonModule,
    AuthModule,
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