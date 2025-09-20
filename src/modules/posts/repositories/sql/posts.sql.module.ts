import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Post Entities
import { PostEntity } from './post.entity';

// Post SQL Repository
import { PostsSQLRepository } from './posts.sql.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostEntity
    ]),
  ],
  providers: [
    {
      provide: 'PostsRepository',
      useClass: PostsSQLRepository,
    },
  ],
  exports: ['PostsRepository'],
})
export class PostsSQLModule {}
