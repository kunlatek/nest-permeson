import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from 'src/common/common.module';
// import { UserModule } from 'src/modules/user/user.module';
// import { AuthModule } from 'src/modules/auth/auth.module';

import { PersonProfileController } from '../../person-profile.controller';
import { PersonProfileService } from '../../person-profile.service';
import { PersonProfileSchema, MongoDBPersonProfile, PersonProfileMongoDBRepository } from '.';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MongoDBPersonProfile.name, schema: PersonProfileSchema },
    ]),
    CommonModule,
  ],
  controllers: [PersonProfileController],
  providers: [
    PersonProfileService,
    {
      provide: 'PersonProfileRepository',
      useClass: PersonProfileMongoDBRepository,
    },
  ],
  exports: [PersonProfileService],
})
export class PersonProfileModule {}
