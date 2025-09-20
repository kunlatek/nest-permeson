import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MongoDBPost, PostDocument } from "./post.schema";
import { CreatePostDto, UpdatePostDto, PostResponseDto } from "../../dto";
import { PostsRepository } from "../../posts.repository.interface";

@Injectable()
export class PostsMongoDBRepository implements PostsRepository {
  constructor(
    @InjectModel(MongoDBPost.name)
    private postModel: Model<PostDocument>
  ) {}

  async create(postDto: CreatePostDto, workspace: string, createdBy: string): Promise<PostResponseDto> {
    const postData = {
      ...postDto,
      dataPublicacao: new Date(postDto.dataPublicacao),
      workspace,
      createdBy: postDto.createdBy || createdBy,
    };
    
    const createdPost = new this.postModel(postData);
    const savedPost = await createdPost.save();
    return this.transformDocumentToResponse(savedPost);
  }

  async findAll(workspace: string, page?: number, limit?: number): Promise<{ posts: PostResponseDto[], total: number }> {
    const query = { workspace };
    
    // Get total count
    const total = await this.postModel.countDocuments(query);
    
    let postsQuery = this.postModel.find(query).sort({ createdAt: -1 });
    
    // Apply pagination if provided
    if (page !== undefined && limit !== undefined) {
      const skip = (page - 1) * limit;
      postsQuery = postsQuery.skip(skip).limit(limit);
    }
    
    const posts = await postsQuery.lean();
    
    return {
      posts: posts.map(post => this.transformDocumentToResponse(post)),
      total
    };
  }

  async findById(id: string, workspace: string): Promise<PostResponseDto> {
    const post = await this.postModel.findOne({ _id: id, workspace }).lean();
    if (!post) return null;
    return this.transformDocumentToResponse(post);
  }

  async update(id: string, postDto: UpdatePostDto, workspace: string): Promise<PostResponseDto> {
    const post = await this.postModel.findOne({ _id: id, workspace });
    
    if (!post) {
      throw new Error(`Post with id ${id} not found in workspace ${workspace}`);
    }

    const updateData: any = { ...postDto };
    if (updateData.dataPublicacao) {
      updateData.dataPublicacao = new Date(updateData.dataPublicacao);
    }

    const updatedPost = await this.postModel.findByIdAndUpdate(id, updateData, { new: true }).lean();
    return this.transformDocumentToResponse(updatedPost);
  }

  async delete(id: string, workspace: string): Promise<void> {
    const post = await this.postModel.findOne({ _id: id, workspace });
    
    if (!post) {
      throw new Error(`Post with id ${id} not found in workspace ${workspace}`);
    }

    await this.postModel.findByIdAndDelete(id);
  }

  // Helper methods
  private transformDocumentToResponse(post: any): PostResponseDto {
    const responseData = {
      ...post,
      _id: post._id.toString(),
      dataPublicacao: post.dataPublicacao instanceof Date 
        ? post.dataPublicacao.toISOString() 
        : post.dataPublicacao,
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
