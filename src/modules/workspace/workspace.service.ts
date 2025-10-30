import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from "@nestjs/common";
import { WorkspaceRepository } from "./workspace.repository.interface";
import { CreateWorkspaceDto, WorkspaceResponseDto } from "./dto";
import { I18nService } from "nestjs-i18n";
import { IMyWorkspacesHttpResponse, IWorkspaceHttpResponse, IWorkspaceTokenHttpResponse } from "./interfaces/workspace-http-response.interface";
import { IHttpResponse } from "src/interfaces/http-response.interface";
import { ProfileService } from "../profile/profile.service";
import { JwtService } from "@nestjs/jwt";
import { RolesService } from "../roles/roles.service";

@Injectable()
export class WorkspaceService {
  constructor(
    @Inject('WorkspaceRepository')
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly profileService: ProfileService,
    private readonly i18n: I18nService,
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => RolesService))
    private readonly rolesService: RolesService,
  ) {}

  async createWorkspace(workspaceDto: CreateWorkspaceDto, lang: string): Promise<WorkspaceResponseDto> {
    try {
      return this.workspaceRepository.create(workspaceDto);
    } catch (error) {
      throw new BadRequestException(this.i18n.t('translation.workspace.error-creating-workspace', { lang }));
    }
  }

  async findWorkspacesByOwner(owner: string, lang: string): Promise<IWorkspaceHttpResponse> {
    try {
      const workspace = await this.workspaceRepository.findByOwner(owner);
      return new IWorkspaceHttpResponse(200, this.i18n.t('translation.workspace.workspace-found', { lang }), new WorkspaceResponseDto(workspace));
    } catch (error) {
      throw new BadRequestException(this.i18n.t('translation.workspace.error-finding-workspaces-by-owner', { lang }));
    }
  }

  async addTeamUser(owner: string, userId: string, roleId: string | undefined, lang: string): Promise<IHttpResponse> {
    try {
      const workspace = await this.workspaceRepository.findByOwner(owner);
      if (!workspace) throw new NotFoundException(this.i18n.t('translation.workspace.workspace-not-found', { lang }));
      
      // Adiciona usuário ao team
      await this.workspaceRepository.addTeamUser(workspace._id, userId);
      
      // Se roleId foi fornecido, adiciona ao ACL
      if (roleId) {
        // Verifica se o role existe
        const roleExists = await this.rolesService.findById(roleId, owner, lang);
        if (!roleExists) {
          throw new NotFoundException(this.i18n.t('translation.workspace.role-not-found', { lang }));
        }
        
        await this.workspaceRepository.addAcl(workspace._id, { userId, roleId });
      }
      
      return new IHttpResponse(204, this.i18n.t('translation.workspace.team-user-added', { lang }));
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(this.i18n.t('translation.workspace.error-adding-team-user', { lang }));
    }
  }

  async removeTeamUser(owner: string, userId: string, lang: string): Promise<IHttpResponse> {
    try {
      const workspace = await this.workspaceRepository.findByOwner(owner);
      if (!workspace) throw new NotFoundException(this.i18n.t('translation.workspace.workspace-not-found', { lang }));

      // Remove usuário do team
      await this.workspaceRepository.removeTeamUser(workspace._id, userId);
      
      // Remove usuário do ACL também (se existir)
      try {
        await this.workspaceRepository.removeAcl(workspace._id, userId);
      } catch (error) {
        // Ignora erro se usuário não estiver no ACL
      }
      
      return new IHttpResponse(204, this.i18n.t('translation.workspace.team-user-removed', { lang }));
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(this.i18n.t('translation.workspace.error-removing-team-user', { lang }));
    }
  }

  async getMyWorkspaces(userId: string, lang: string): Promise<IMyWorkspacesHttpResponse> {
    try {
      const workspaces = await this.workspaceRepository.findByTeamUser(userId);
      const userNames = await this.profileService.getProfileUserNamesByUserIds(workspaces.map((workspace) => workspace.owner), lang);
      return new IMyWorkspacesHttpResponse(
        200, 
        this.i18n.t('translation.workspace.my-workspaces-found', { lang }), 
        workspaces.map((workspace) => new WorkspaceResponseDto({...workspace, name: userNames.find((user) => user.userId === workspace.owner)?.userName}))
      );
    } catch (error) {
      throw new BadRequestException(this.i18n.t('translation.workspace.error-finding-my-workspaces', { lang }));
    }
  }

  async getWorkspaceToken(userId: string, workspaceId: string, lang: string): Promise<IWorkspaceTokenHttpResponse> {
    try {
      const workspace = await this.workspaceRepository.findById(workspaceId);
      const userIsInWorkspaceTeam = workspace.team.includes(userId);
      if (!userIsInWorkspaceTeam) throw new NotFoundException(this.i18n.t('translation.workspace.user-not-in-workspace', { lang }));

      const token = this.jwtService.sign({ sub: userId, workspaceId, userId, workspaceOwnerId: workspace.owner });
      return new IWorkspaceTokenHttpResponse(200, this.i18n.t('translation.workspace.workspace-token-found', { lang }), token);
    } catch (error) {
      throw new BadRequestException(this.i18n.t('translation.workspace.error-finding-workspace-token', { lang }));
    }
  }

  async deleteWorkspace(id: string, lang: string): Promise<void> {
    try {
      return this.workspaceRepository.delete(id);
    } catch (error) {
      throw new BadRequestException(this.i18n.t('translation.workspace.error-deleting-workspace', { lang }));
    }
  }

  async updateAcl(owner: string, userId: string, roleId: string, lang: string): Promise<IHttpResponse> {
    try {
      // Verifica se o role existe
      const roleExists = await this.rolesService.findById(roleId, owner, lang);
      if (!roleExists) {
        throw new NotFoundException(this.i18n.t('translation.workspace.role-not-found', { lang }));
      }

      const workspace = await this.workspaceRepository.findByOwner(owner);
      if (!workspace) {
        throw new NotFoundException(this.i18n.t('translation.workspace.workspace-not-found', { lang }));
      }

      await this.workspaceRepository.updateAcl(workspace._id, userId, roleId);
      return new IHttpResponse(200, this.i18n.t('translation.workspace.acl-user-updated', { lang }));
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(this.i18n.t('translation.workspace.error-updating-acl-user', { lang }));
    }
  }
}