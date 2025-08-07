import { Body, Controller, Delete, Get, HttpCode, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { Param } from "@nestjs/common";
import { UpdateWorkspaceTeamDto } from "./dto";
import { WorkspaceService } from "./workspace.service";
import { AuthGuard } from "@nestjs/passport";
import { I18nLang } from "nestjs-i18n";
import { IMyWorkspacesHttpResponse, IWorkspaceHttpResponse, IWorkspaceTokenHttpResponse } from "./interfaces/workspace-http-response.interface";
import { IHttpResponse } from "src/interfaces/http-response.interface";

@ApiTags('Workspace')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('workspaces')
export class WorkspaceController {
  constructor(
    private readonly workspaceService: WorkspaceService,
  ) {}

  @Get('')
  @ApiSecurity('jwt')
  @ApiOperation({ summary: 'Get workspace' })
  @ApiResponse({ status: 200, description: 'Workspace retrieved successfully', type: IWorkspaceHttpResponse })
  async findWorkspaceByOwner(
    @Req() req: any,
    @I18nLang() lang?: string
  ): Promise<IWorkspaceHttpResponse> {
    return this.workspaceService.findWorkspacesByOwner(req.user.userId, lang);
  }

  @Post('team-user')
  @HttpCode(200)
  @ApiSecurity('jwt')
  @ApiOperation({ summary: 'Add team user' })
  @ApiResponse({ status: 204, description: 'Team user added successfully' })
  async addTeamUser(
    @Req() req: any,
    @Body() body: UpdateWorkspaceTeamDto,
    @I18nLang() lang?: string
  ): Promise<IHttpResponse> {
    return this.workspaceService.addTeamUser(req.user.userId, body.userId, lang);
  }

  @Delete('team-user')
  @ApiSecurity('jwt')
  @ApiOperation({ summary: 'Remove team user' })
  @ApiResponse({ status: 204, description: 'Team user removed successfully' })
  async removeTeamUser(
    @Req() req: any,
    @Body() body: UpdateWorkspaceTeamDto,
    @I18nLang() lang?: string
  ): Promise<IHttpResponse> {
    return this.workspaceService.removeTeamUser(req.user.userId, body.userId, lang);
  }

  @Get('my')
  @ApiSecurity('jwt')
  @ApiOperation({ summary: 'Get my workspaces' })
  @ApiResponse({ status: 200, description: 'My workspaces retrieved successfully', type: IMyWorkspacesHttpResponse })
  async getMyWorkspaces(
    @Req() req: any,
    @I18nLang() lang?: string
  ): Promise<IMyWorkspacesHttpResponse> {
    return this.workspaceService.getMyWorkspaces(req.user.userId, lang);
  }

  @Get('token/:workspaceId')
  @ApiSecurity('jwt')
  @ApiOperation({ summary: 'Get workspace token' })
  @ApiResponse({ status: 200, description: 'Workspace token retrieved successfully', type: IWorkspaceTokenHttpResponse })
  async getWorkspaceToken(
    @Req() req: any,
    @Param('workspaceId') workspaceId: string,
    @I18nLang() lang?: string
  ): Promise<IWorkspaceTokenHttpResponse> {
    return this.workspaceService.getWorkspaceToken(req.user.userId, workspaceId, lang);
  }
}