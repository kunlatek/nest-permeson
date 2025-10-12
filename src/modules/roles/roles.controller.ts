import { Body, Controller, Delete, Get, HttpCode, Post, Put, Req, UseGuards, Param, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiSecurity, ApiTags, ApiQuery } from "@nestjs/swagger";
import { RolesService } from "./roles.service";
import { AuthGuard } from "@nestjs/passport";
import { I18nLang } from "nestjs-i18n";
import { CreateRoleDto, UpdateRoleDto, RolesFilterDto } from "./dto";
import { IRoleHttpResponse, IRolesHttpResponse, IRolesPaginatedHttpResponse } from "./interfaces";
import { IHttpResponse } from "src/interfaces/http-response.interface";

@ApiTags('Roles')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('roles')
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
  ) {}

  @Post('')
  @ApiSecurity('jwt')
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'Role created successfully', type: IRoleHttpResponse })
  async create(
    @Req() req: any,
    @Body() body: CreateRoleDto,
    @I18nLang() lang?: string
  ): Promise<IRoleHttpResponse> {
    const workspaceId = body.workspaceId || req.user.workspaceId;
    const createdBy = body.createdBy || req.user.userId;
    
    return this.rolesService.create(body, workspaceId, createdBy, lang);
  }

  @Get('')
  @ApiSecurity('jwt')
  @ApiOperation({ summary: 'Get all roles from workspace' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
  @ApiQuery({ name: 'name', required: false, type: String, description: 'Filter roles by name (case-insensitive partial match)' })
  @ApiResponse({ status: 200, description: 'Roles retrieved successfully', type: IRolesPaginatedHttpResponse })
  async findAll(
    @Req() req: any,
    @Query() query: RolesFilterDto,
    @I18nLang() lang?: string
  ): Promise<IRolesPaginatedHttpResponse | IRolesHttpResponse> {
    const workspaceId = req.user.workspaceId;
    return this.rolesService.findAll(workspaceId, lang, query.page, query.limit, query.name);
  }

  @Get(':id')
  @ApiSecurity('jwt')
  @ApiOperation({ summary: 'Get role by ID' })
  @ApiResponse({ status: 200, description: 'Role retrieved successfully', type: IRoleHttpResponse })
  async findById(
    @Req() req: any,
    @Param('id') id: string,
    @I18nLang() lang?: string
  ): Promise<IRoleHttpResponse> {
    const workspaceId = req.user.workspaceId;
    return this.rolesService.findById(id, workspaceId, lang);
  }

  @Put(':id')
  @ApiSecurity('jwt')
  @ApiOperation({ summary: 'Update role by ID' })
  @ApiResponse({ status: 200, description: 'Role updated successfully', type: IRoleHttpResponse })
  @ApiResponse({ status: 403, description: 'Insufficient permissions - user must be role creator or workspace owner' })
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: UpdateRoleDto,
    @I18nLang() lang?: string
  ): Promise<IRoleHttpResponse> {
    const workspaceId = req.user.workspaceId;
    const userId = req.user.userId;
    return this.rolesService.update(id, body, workspaceId, userId, lang);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiSecurity('jwt')
  @ApiOperation({ summary: 'Delete role by ID' })
  @ApiResponse({ status: 204, description: 'Role deleted successfully' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions - user must be role creator or workspace owner' })
  async delete(
    @Req() req: any,
    @Param('id') id: string,
    @I18nLang() lang?: string
  ): Promise<IHttpResponse> {
    const workspaceId = req.user.workspaceId;
    const userId = req.user.userId;
    return this.rolesService.delete(id, workspaceId, userId, lang);
  }
}

