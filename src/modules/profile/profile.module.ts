import { Module } from '@nestjs/common';

import { ProfileService } from './profile.service';
import { CompanyProfileModule } from '../company-profile/company-profile.module';
import { PersonProfileModule } from '../person-profile/person-profile.module';
import { ProfileController } from './profile.controller';

@Module({
  imports: [
    CompanyProfileModule,
    PersonProfileModule,
  ],
  providers: [
    ProfileService,
  ],
  controllers: [ProfileController],
  exports: [ProfileService],
})
export class ProfileModule {}
