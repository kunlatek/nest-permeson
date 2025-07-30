import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// User Entity
import { UserEntity } from './user.entity';

// User SQL Repository
import { UserSQLRepository } from './user.sql.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
    ]),
  ],
  providers: [
    {
      provide: 'UserRepository',
      useClass: UserSQLRepository,
    },
  ],
  exports: ['UserRepository'],
})
export class UserSQLModule {} 