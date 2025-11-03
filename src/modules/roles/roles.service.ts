import { BadRequestException, Inject, Injectable, NotFoundException, ForbiddenException, forwardRef } from "@nestjs/common";
import { RolesRepository } from "./roles.repository.interface";
import { CreateRoleDto, UpdateRoleDto } from "./dto";
import { I18nService } from "nestjs-i18n";
import { IRoleHttpResponse, IRolesHttpResponse, IRolesPaginatedHttpResponse } from "./interfaces";
import { IHttpResponse } from "src/interfaces/http-response.interface";
import { WorkspaceService } from "../workspace/workspace.service";

@Injectable()
export class RolesService {
  constructor(
    @Inject('RolesRepository')
    private readonly rolesRepository: RolesRepository,
    private readonly i18n: I18nService,
    @Inject(forwardRef(() => WorkspaceService))
    private readonly workspaceService: WorkspaceService,
  ) {}

  private async checkUserPermissions(userId: string, workspaceId: string, roleId: string, lang: string): Promise<void> {
    try {
      const role = await this.rolesRepository.findByIdAndWorkspace(roleId, workspaceId);
      if (!role) {
        throw new NotFoundException(this.i18n.t('translation.roles.role-not-found', { lang }));
      }

      if (role.role.createdBy === userId) {
        return;
      }

      try {
        await this.workspaceService.findWorkspacesByOwner(userId, lang);
      } catch (error) {
        // Se não encontrou workspace por owner, continua para verificar outras permissões
      }

      throw new ForbiddenException(this.i18n.t('translation.roles.insufficient-permissions', { lang }));
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new BadRequestException(this.i18n.t('translation.roles.error-checking-permissions', { lang }));
    }
  }

  async create(roleDto: CreateRoleDto, workspace: string, createdBy: string, lang: string): Promise<IRoleHttpResponse> {
    try {
      const role = await this.rolesRepository.create(roleDto, workspace, createdBy);
      return new IRoleHttpResponse(201, this.i18n.t('translation.roles.role-created', { lang }), role);
    } catch (error) {
      console.error(error);
      throw new BadRequestException(this.i18n.t('translation.roles.error-creating-role', { lang }));
    }
  }

  async findAll(workspace: string, lang: string, page?: number, limit?: number, filters?: string): Promise<IRolesPaginatedHttpResponse | IRolesHttpResponse> {
    try {
      const filtersObject = JSON.parse(filters || '[]');
      if (page !== undefined && limit !== undefined) {
        const result = await this.rolesRepository.findAll(workspace, page, limit, filtersObject);
        return new IRolesPaginatedHttpResponse(200, this.i18n.t('translation.roles.roles-found', { lang }), result.roles, result.total, page, limit);
      } else {
        const result = await this.rolesRepository.findAll(workspace, undefined, undefined, filtersObject);
        return new IRolesHttpResponse(200, this.i18n.t('translation.roles.roles-found', { lang }), result.roles);
      }
    } catch (error) {
      console.error(error);
      throw new BadRequestException(this.i18n.t('translation.roles.error-finding-roles', { lang }));
    }
  }

  async findById(id: string, lang: string): Promise<IRoleHttpResponse> {
    try {
      const role = await this.rolesRepository.findById(id);
      if (!role) {
        throw new NotFoundException(this.i18n.t('translation.roles.role-not-found', { lang }));
      }
      return new IRoleHttpResponse(200, this.i18n.t('translation.roles.role-found', { lang }), role);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(this.i18n.t('translation.roles.error-finding-role', { lang }));
    }
  }

  async update(id: string, roleDto: UpdateRoleDto, workspace: string, userId: string, lang: string): Promise<IRoleHttpResponse> {
    try {
      await this.checkUserPermissions(userId, workspace, id, lang);
      
      const role = await this.rolesRepository.update(id, roleDto, workspace);
      return new IRoleHttpResponse(200, this.i18n.t('translation.roles.role-updated', { lang }), role);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      if (error.message.includes('not found')) {
        throw new NotFoundException(this.i18n.t('translation.roles.role-not-found', { lang }));
      }
      throw new BadRequestException(this.i18n.t('translation.roles.error-updating-role', { lang }));
    }
  }

  async delete(id: string, workspace: string, userId: string, lang: string): Promise<IHttpResponse> {
    try {
      await this.checkUserPermissions(userId, workspace, id, lang);
      
      await this.rolesRepository.delete(id, workspace);
      return new IHttpResponse(204, this.i18n.t('translation.roles.role-deleted', { lang }));
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      if (error.message.includes('not found')) {
        throw new NotFoundException(this.i18n.t('translation.roles.role-not-found', { lang }));
      }
      throw new BadRequestException(this.i18n.t('translation.roles.error-deleting-role', { lang }));
    }
  }
}

