import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from 'src/common/common.module';

  import { MongoDBCompanyProfile, CompanyProfileSchema, CompanyProfileMongoDBRepository } from '.';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MongoDBCompanyProfile.name, schema: CompanyProfileSchema },
    ]),
    CommonModule,
  ],
  providers: [
    {
      provide: 'CompanyProfileRepository',
      useClass: CompanyProfileMongoDBRepository,
    },
  ],
  exports: ['CompanyProfileRepository'],
})
export class CompanyProfileModule {}
