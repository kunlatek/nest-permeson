import { CreatePostDto, UpdatePostDto, PostResponseDto } from "./dto";

export interface PostsRepository {
  create(postDto: CreatePostDto, workspace: string, createdBy: string): Promise<PostResponseDto>;

  findAll(workspace: string, page?: number, limit?: number): Promise<{ posts: PostResponseDto[], total: number }>;

  findById(id: string, workspace: string): Promise<PostResponseDto>;

  update(id: string, postDto: UpdatePostDto, workspace: string): Promise<PostResponseDto>;

  delete(id: string, workspace: string): Promise<void>;
}
