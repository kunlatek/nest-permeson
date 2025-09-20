import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { PostsRepository } from "./posts.repository.interface";
import { CreatePostDto, UpdatePostDto, PostResponseDto, PostsFilterDto } from "./dto";
import { I18nService } from "nestjs-i18n";
import { IPostHttpResponse, IPostsHttpResponse, IPostsPaginatedHttpResponse } from "./interfaces";
import { IHttpResponse } from "src/interfaces/http-response.interface";

@Injectable()
export class PostsService {
  constructor(
    @Inject('PostsRepository')
    private readonly postsRepository: PostsRepository,
    private readonly i18n: I18nService,
  ) {}

  async create(postDto: CreatePostDto, workspace: string, createdBy: string, lang: string): Promise<IPostHttpResponse> {
    try {
      const post = await this.postsRepository.create(postDto, workspace, createdBy);
      return new IPostHttpResponse(201, this.i18n.t('translation.posts.post-created', { lang }), post);
    } catch (error) {
      console.error(error);
      throw new BadRequestException(this.i18n.t('translation.posts.error-creating-post', { lang }));
    }
  }

  async findAll(workspace: string, lang: string, page?: number, limit?: number): Promise<IPostsPaginatedHttpResponse | IPostsHttpResponse> {
    try {
      if (page !== undefined && limit !== undefined) {
        const result = await this.postsRepository.findAll(workspace, page, limit);
        return new IPostsPaginatedHttpResponse(200, this.i18n.t('translation.posts.posts-found', { lang }), result.posts, result.total, page, limit);
      } else {
        const result = await this.postsRepository.findAll(workspace);
        return new IPostsHttpResponse(200, this.i18n.t('translation.posts.posts-found', { lang }), result.posts);
      }
    } catch (error) {
      throw new BadRequestException(this.i18n.t('translation.posts.error-finding-posts', { lang }));
    }
  }

  async findById(id: string, workspace: string, lang: string): Promise<IPostHttpResponse> {
    try {
      const post = await this.postsRepository.findById(id, workspace);
      if (!post) {
        throw new NotFoundException(this.i18n.t('translation.posts.post-not-found', { lang }));
      }
      return new IPostHttpResponse(200, this.i18n.t('translation.posts.post-found', { lang }), post);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(this.i18n.t('translation.posts.error-finding-post', { lang }));
    }
  }

  async update(id: string, postDto: UpdatePostDto, workspace: string, lang: string): Promise<IPostHttpResponse> {
    try {
      const post = await this.postsRepository.update(id, postDto, workspace);
      return new IPostHttpResponse(200, this.i18n.t('translation.posts.post-updated', { lang }), post);
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new NotFoundException(this.i18n.t('translation.posts.post-not-found', { lang }));
      }
      throw new BadRequestException(this.i18n.t('translation.posts.error-updating-post', { lang }));
    }
  }

  async delete(id: string, workspace: string, lang: string): Promise<IHttpResponse> {
    try {
      await this.postsRepository.delete(id, workspace);
      return new IHttpResponse(204, this.i18n.t('translation.posts.post-deleted', { lang }));
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new NotFoundException(this.i18n.t('translation.posts.post-not-found', { lang }));
      }
      throw new BadRequestException(this.i18n.t('translation.posts.error-deleting-post', { lang }));
    }
  }
}
