import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PostEntity } from "./post.entity";
import { CreatePostDto, UpdatePostDto, PostResponseDto } from "../../dto";
import { PostsRepository } from "../../posts.repository.interface";

@Injectable()
export class PostsSQLRepository implements PostsRepository {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>
  ) {}

  async create(postDto: CreatePostDto, workspace: string, createdBy: string): Promise<PostResponseDto> {
    const postData = {
      ...postDto,
      publishedAt: new Date(postDto.publishedAt),
      workspace,
      createdBy: postDto.createdBy || createdBy,
    };
    
    const savedPost = await this.postRepository.save(postData);
    return this.findById(savedPost.id.toString(), workspace);
  }

  async findAll(workspace: string, page?: number, limit?: number): Promise<{ posts: PostResponseDto[], total: number }> {
    const whereCondition = { workspace };
    
    // Get total count
    const total = await this.postRepository.count({ where: whereCondition });
    
    // Build query options
    const findOptions: any = { 
      where: whereCondition,
      order: { createdAt: 'DESC' }
    };
    
    // Apply pagination if provided
    if (page !== undefined && limit !== undefined) {
      const skip = (page - 1) * limit;
      findOptions.skip = skip;
      findOptions.take = limit;
    }
    
    const posts = await this.postRepository.find(findOptions);
    
    return {
      posts: posts.map(post => this.transformEntityToResponse(post)),
      total
    };
  }

  async findById(id: string, workspace: string): Promise<PostResponseDto> {
    const post = await this.postRepository.findOne({ 
      where: { id: parseInt(id), workspace }
    });
    if (!post) return null;
    return this.transformEntityToResponse(post);
  }

  async update(id: string, postDto: UpdatePostDto, workspace: string): Promise<PostResponseDto> {
    const post = await this.postRepository.findOne({ 
      where: { id: parseInt(id), workspace }
    });
    
    if (!post) {
      throw new Error(`Post with id ${id} not found in workspace ${workspace}`);
    }

    const updateData: any = { ...postDto };
    if (updateData.publishedAt) {
      updateData.publishedAt = new Date(updateData.publishedAt);
    }

    await this.postRepository.update(parseInt(id), updateData as any);
    return this.findById(id, workspace);
  }

  async delete(id: string, workspace: string): Promise<void> {
    const post = await this.postRepository.findOne({ 
      where: { id: parseInt(id), workspace }
    });
    
    if (!post) {
      throw new Error(`Post with id ${id} not found in workspace ${workspace}`);
    }

    await this.postRepository.delete(parseInt(id));
  }

  // Helper methods
  private transformEntityToResponse(post: PostEntity): PostResponseDto {
    const responseData = {
      ...post,
      _id: post.id.toString(),
      publishedAt: post.publishedAt instanceof Date 
        ? post.publishedAt.toISOString() 
        : post.publishedAt,
      createdAt: post.createdAt instanceof Date 
        ? post.createdAt.toISOString() 
        : post.createdAt,
      updatedAt: post.updatedAt instanceof Date 
        ? post.updatedAt.toISOString() 
        : post.updatedAt,
    };

    return new PostResponseDto(responseData);
  }
}
