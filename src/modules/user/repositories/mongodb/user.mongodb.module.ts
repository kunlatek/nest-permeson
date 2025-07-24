import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoDBUser, UserSchema, UserMongoDBRepository } from '.';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MongoDBUser.name, schema: UserSchema }
    ]),
  ],
  providers: [
    {
      provide: 'UserRepository',
      useClass: UserMongoDBRepository,
    },
  ],
  exports: ['UserRepository'],
})
export class UserMongoDBModule {} 