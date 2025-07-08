import { Module } from '@nestjs/common';

import { ProfileService } from './profile.service';
import { DATABASE } from 'src/common/constants/database.constant';
import { CompanyProfileModule } from './company/company-profile.module';
import { PersonProfileModule } from './person/person-profile.module';
import { ProfileController } from './profile.controller';

@Module({
  imports: [
    ...CompanyProfileModule(DATABASE),
    ...PersonProfileModule(DATABASE)
  ],
  providers: [
    ProfileService,
  ],
  controllers: [ProfileController],
  exports: [ProfileService],
})
export class ProfileModule {}
