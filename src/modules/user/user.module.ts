import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './schemas/user.schema';
import {
  MongoDBCompanyProfile,
  CompanyProfileSchema,
} from '../profile/company/repositories/mongodb/company-profile.schema';
import {
  MongoDBPersonProfile,
  PersonProfileSchema,
} from '../profile/person/repositories/mongodb/person-profile.schema';
import { CommonModule } from 'src/common/common.module';
import { SmsCodeModule } from '../smsCode/sms-code.module';
import { InvitationModule } from '../invitation/invitation.module';
import { DATABASE } from 'src/common/constants/database.constant';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: MongoDBCompanyProfile.name, schema: CompanyProfileSchema },
    ]),
    MongooseModule.forFeature([
      { name: MongoDBPersonProfile.name, schema: PersonProfileSchema },
    ]),
    CommonModule,
    SmsCodeModule,
    ...InvitationModule(DATABASE),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
