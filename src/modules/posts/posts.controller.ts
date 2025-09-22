import { Body, Controller, Delete, Get, HttpCode, Post, Put, Req, UseGuards, Param, Query, UploadedFile, UseInterceptors, UploadedFiles } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiSecurity, ApiTags, ApiQuery, ApiConsumes, ApiBody, ApiParam } from "@nestjs/swagger";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { PostsService } from "./posts.service";
import { AuthGuard } from "@nestjs/passport";
import { I18nLang } from "nestjs-i18n";
import { CreatePostDto, UpdatePostDto, PostsFilterDto } from "./dto";
import { IPostHttpResponse, IPostsHttpResponse, IPostsPaginatedHttpResponse } from "./interfaces";
import { IHttpResponse } from "src/interfaces/http-response.interface";
import { getUploadService } from "src/utils/upload.utils";
import { STORAGE } from "src/common/constants/storage.constant";
import { ConfigService } from "@nestjs/config";
import { UploadServiceInterface } from "src/common/services/upload/upload-service.interface";

@ApiTags('Posts')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('posts')
export class PostsController {
  private readonly uploadService: UploadServiceInterface;

  constructor(
    private readonly postsService: PostsService,
    private readonly configService: ConfigService,
  ) {
    const UploadServiceClass = getUploadService(STORAGE);
    this.uploadService = new UploadServiceClass(this.configService);
  }

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

  @Post(':id/upload/:field')
  @UseInterceptors(FilesInterceptor('files', 10)) // Máximo 10 arquivos
  @ApiSecurity('jwt')
  @ApiOperation({ 
    summary: 'Upload multiple files for post field',
    description: 'Upload multiple files to a specific field of a post. The files will be stored and the post will be updated with the file information. You can specify which existing files to keep.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Multiple files upload with optional keep files list',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary'
          },
          description: 'Files to upload'
        },
        keepFiles: {
          type: 'string',
          description: 'JSON string of array of objects with name and url of files to keep: [{"name": "file1.jpg", "url": "http://..."}]'
        }
      },
      required: ['files']
    }
  })
  @ApiResponse({ status: 200, description: 'Files uploaded successfully', type: IPostHttpResponse })
  @ApiResponse({ status: 400, description: 'Bad request - No files provided or invalid keepFiles format' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiParam({name: 'id',description: 'Post ID',example: '123',type: 'string' })
  @ApiParam({name: 'field',description: 'Field name where the files will be stored (e.g., gallery, documents, images)', example: 'gallery',type: 'string' })
  async uploadMultipleFiles(
    @Req() req: any,
    @Param('id') id: string,
    @Param('field') field: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body('keepFiles') keepFilesString?: string,
    @I18nLang() lang?: string
  ): Promise<IPostHttpResponse> {
    const workspaceId = req.user.workspaceId;
    
    if (!files || files.length === 0) {
      throw new Error('No files provided');
    }

    const keepFilesArray = JSON.parse(keepFilesString || '[]');
    const keepFiles = keepFilesArray
      .filter(item => item && typeof item === 'object' && item.url)
      .map(item => item.url.split('/').pop());
    

    const path = `/posts/${id}/${field}`;
    
    // Gera nomes únicos para os arquivos baseados no timestamp e nome original
    const fileNames = files.map((file, index) => {
      const timestamp = Date.now();
      const extension = file.originalname.split('.').pop() || '';
      return `${field}_${timestamp}_${index}.${extension}`;
    });

    // Upload dos arquivos
    const urls = await this.uploadService.uploadMultipleFiles(files, path, fileNames, keepFiles);

    // Cria array de objetos com name e url para cada arquivo
    const fileData = files.map((file, index) => ({
      name: file.originalname || '',
      url: urls[index]
    }));

    const updateData = { [field]: [...(keepFilesArray || []), ...fileData] };

    return this.postsService.update(id, updateData, workspaceId, lang);
  }
}
