import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Post MongoDB Schema
import { MongoDBPost, PostSchema } from './post.schema';

// Post MongoDB Repository
import { PostsMongoDBRepository } from './posts.mongodb.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MongoDBPost.name, schema: PostSchema }
    ]),
  ],
  providers: [
    {
      provide: 'PostsRepository',
      useClass: PostsMongoDBRepository,
    },
  ],
  exports: ['PostsRepository'],
})
export class PostsMongoDBModule {}
