import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from 'src/common/common.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

import { CompanyProfileController } from './company/company-profile.controller';
import { CompanyProfileService } from './company/company-profile.service';
import { MongoDBCompanyProfile, CompanyProfileSchema, CompanyProfileMongoDBRepository } from './company/repositories/mongodb';

import { PersonProfileController } from './person/person-profile.controller';
import { PersonProfileService } from './person/person-profile.service';
import { PersonProfileSchema, MongoDBPersonProfile, PersonProfileMongoDBRepository } from './person/repositories/mongodb';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MongoDBPersonProfile.name, schema: PersonProfileSchema },
      { name: MongoDBCompanyProfile.name, schema: CompanyProfileSchema },
    ]),
    CommonModule,
    UserModule,
    AuthModule,
  ],
  controllers: [CompanyProfileController, PersonProfileController],
  providers: [
    PersonProfileService,
    {
      provide: 'PersonProfileRepository',
      useClass: PersonProfileMongoDBRepository,
    },
    CompanyProfileService,
    {
      provide: 'CompanyProfileRepository',
      useClass: CompanyProfileMongoDBRepository,
    },
  ],
  exports: [PersonProfileService, CompanyProfileService],
})
export class ProfileModule {}
