import { Body, Controller, Delete, Get, HttpCode, Post, Put, Req, UseGuards, Param, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiSecurity, ApiTags, ApiQuery } from "@nestjs/swagger";
import { PostsService } from "./posts.service";
import { AuthGuard } from "@nestjs/passport";
import { I18nLang } from "nestjs-i18n";
import { CreatePostDto, UpdatePostDto, PostsFilterDto } from "./dto";
import { IPostHttpResponse, IPostsHttpResponse, IPostsPaginatedHttpResponse } from "./interfaces";
import { IHttpResponse } from "src/interfaces/http-response.interface";

@ApiTags('Posts')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
  ) {}

  @Post('')
  @ApiSecurity('jwt')
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, description: 'Post created successfully', type: IPostHttpResponse })
  async create(
    @Req() req: any,
    @Body() body: CreatePostDto,
    @I18nLang() lang?: string
  ): Promise<IPostHttpResponse> {
    const workspaceId = body.workspaceId || req.user.workspaceId;
    const createdBy = body.createdBy || req.user.userId;
    
    return this.postsService.create(body, workspaceId, createdBy, lang);
  }

  @Get('')
  @ApiSecurity('jwt')
  @ApiOperation({ summary: 'Get all posts from workspace' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
  @ApiResponse({ status: 200, description: 'Posts retrieved successfully', type: IPostsPaginatedHttpResponse })
  async findAll(
    @Req() req: any,
    @Query() query: PostsFilterDto,
    @I18nLang() lang?: string
  ): Promise<IPostsPaginatedHttpResponse | IPostsHttpResponse> {
    const workspaceId = req.user.workspaceId;
    return this.postsService.findAll(workspaceId, lang, query.page, query.limit);
  }

  @Get(':id')
  @ApiSecurity('jwt')
  @ApiOperation({ summary: 'Get post by ID' })
  @ApiResponse({ status: 200, description: 'Post retrieved successfully', type: IPostHttpResponse })
  async findById(
    @Req() req: any,
    @Param('id') id: string,
    @I18nLang() lang?: string
  ): Promise<IPostHttpResponse> {
    const workspaceId = req.user.workspaceId;
    return this.postsService.findById(id, workspaceId, lang);
  }

  @Put(':id')
  @ApiSecurity('jwt')
  @ApiOperation({ summary: 'Update post by ID' })
  @ApiResponse({ status: 200, description: 'Post updated successfully', type: IPostHttpResponse })
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: UpdatePostDto,
    @I18nLang() lang?: string
  ): Promise<IPostHttpResponse> {
    const workspaceId = req.user.workspaceId;
    return this.postsService.update(id, body, workspaceId, lang);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiSecurity('jwt')
  @ApiOperation({ summary: 'Delete post by ID' })
  @ApiResponse({ status: 204, description: 'Post deleted successfully' })
  async delete(
    @Req() req: any,
    @Param('id') id: string,
    @I18nLang() lang?: string
  ): Promise<IHttpResponse> {
    const workspaceId = req.user.workspaceId;
    return this.postsService.delete(id, workspaceId, lang);
  }
}
