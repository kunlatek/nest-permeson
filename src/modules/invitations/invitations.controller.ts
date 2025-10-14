import { Body, Controller, Delete, Get, HttpCode, Post, Put, Req, UseGuards, Param, Query, BadRequestException } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiSecurity, ApiTags, ApiQuery, ApiParam } from "@nestjs/swagger";
import { InvitationsService } from "./invitations.service";
import { AuthGuard } from "@nestjs/passport";
import { I18nLang } from "nestjs-i18n";
import { CreateInvitationDto, UpdateInvitationDto, InvitationsFilterDto, CreateAdminInvitationDto } from "./dto";
import { IInvitationHttpResponse, IInvitationsHttpResponse, IInvitationsPaginatedHttpResponse } from "./interfaces";
import { IHttpResponse } from "src/interfaces/http-response.interface";

@ApiTags('Invitations')
@Controller('invitations')
export class InvitationsController {
  constructor(
    private readonly invitationsService: InvitationsService,
  ) {}

  @Post('')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiSecurity('jwt')
  @ApiOperation({ summary: 'Create a new invitation' })
  @ApiResponse({ status: 201, description: 'Invitation created successfully', type: IInvitationHttpResponse })
  @ApiResponse({ status: 400, description: 'Bad request - User already registered or invitation already exists' })
  async create(
    @Req() req: any,
    @Body() body: CreateInvitationDto,
    @I18nLang() lang?: string
  ): Promise<IInvitationHttpResponse> {
    const workspaceId = body.workspaceId || req.user.workspaceId;
    const createdBy = body.createdBy || req.user.userId;
    
    return this.invitationsService.create(body, workspaceId, createdBy, lang);
  }
  
  @Post('admin')
  @ApiOperation({ summary: 'Create a new admin invitation' })
  @ApiResponse({ status: 201, description: 'Invitation created successfully', type: IInvitationHttpResponse })
  @ApiResponse({ status: 400, description: 'Bad request - User already registered or invitation already exists' })
  async createAdmin(
    @Body() body: CreateAdminInvitationDto,
    @I18nLang() lang?: string
  ): Promise<IInvitationHttpResponse> {
    if (body.passCode !== process.env.ADMIN_PASS_CODE) {
      throw new BadRequestException('Invalid pass code');
    }
    
    return this.invitationsService.createAdmin(body, lang);
  }

  @Get('')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiSecurity('jwt')
  @ApiOperation({ summary: 'Get all invitations from workspace' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
  @ApiQuery({ name: 'email', required: false, type: String, description: 'Filter invitations by email (case-insensitive partial match)' })
  @ApiQuery({ name: 'accepted', required: false, type: Boolean, description: 'Filter invitations by accepted status' })
  @ApiResponse({ status: 200, description: 'Invitations retrieved successfully', type: IInvitationsPaginatedHttpResponse })
  async findAll(
    @Req() req: any,
    @Query() query: InvitationsFilterDto,
    @I18nLang() lang?: string
  ): Promise<IInvitationsPaginatedHttpResponse | IInvitationsHttpResponse> {
    const workspaceId = req.user.workspaceId;
    return this.invitationsService.findAll(workspaceId, lang, query.page, query.limit, query.email, query.accepted);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiSecurity('jwt')
  @ApiOperation({ summary: 'Get invitation by ID' })
  @ApiResponse({ status: 200, description: 'Invitation retrieved successfully', type: IInvitationHttpResponse })
  async findById(
    @Req() req: any,
    @Param('id') id: string,
    @I18nLang() lang?: string
  ): Promise<IInvitationHttpResponse> {
    const workspaceId = req.user.workspaceId;
    return this.invitationsService.findById(id, workspaceId, lang);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiSecurity('jwt')
  @ApiOperation({ summary: 'Update invitation by ID' })
  @ApiResponse({ status: 200, description: 'Invitation updated successfully', type: IInvitationHttpResponse })
  @ApiResponse({ status: 403, description: 'Insufficient permissions - user must be invitation creator or workspace owner' })
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: UpdateInvitationDto,
    @I18nLang() lang?: string
  ): Promise<IInvitationHttpResponse> {
    const workspaceId = req.user.workspaceId;
    const userId = req.user.userId;
    return this.invitationsService.update(id, body, workspaceId, userId, lang);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiSecurity('jwt')
  @ApiOperation({ summary: 'Delete invitation by ID' })
  @ApiResponse({ status: 204, description: 'Invitation deleted successfully' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions - user must be invitation creator or workspace owner' })
  async delete(
    @Req() req: any,
    @Param('id') id: string,
    @I18nLang() lang?: string
  ): Promise<IHttpResponse> {
    const workspaceId = req.user.workspaceId;
    const userId = req.user.userId;
    return this.invitationsService.delete(id, workspaceId, userId, lang);
  }

  @Post(':id/resend')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiSecurity('jwt')
  @ApiOperation({ summary: 'Resend invitation email' })
  @ApiParam({ name: 'id', description: 'Invitation ID', example: '123', type: 'string' })
  @ApiResponse({ status: 200, description: 'Invitation email resent successfully', type: IHttpResponse })
  @ApiResponse({ status: 400, description: 'Bad request - Invitation already accepted' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions - user must be invitation creator or workspace owner' })
  @ApiResponse({ status: 404, description: 'Invitation not found' })
  async resendInvitation(
    @Req() req: any,
    @Param('id') id: string,
    @I18nLang() lang?: string
  ): Promise<IHttpResponse> {
    const workspaceId = req.user.workspaceId;
    const userId = req.user.userId;
    return this.invitationsService.resendInvitation(id, workspaceId, userId, lang);
  }
}

