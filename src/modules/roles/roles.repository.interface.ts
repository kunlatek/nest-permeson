import { CreateRoleDto, UpdateRoleDto, RoleResponseDto } from "./dto";

export interface RolesRepository {
  create(roleDto: CreateRoleDto, workspace: string, createdBy: string): Promise<RoleResponseDto>;
  findAll(workspace: string, page?: number, limit?: number, filters?: any[]): Promise<{ roles: RoleResponseDto[]; total: number }>;
  findById(id: string): Promise<RoleResponseDto | null>;
  findByIdAndWorkspace(id: string, workspace: string): Promise<RoleResponseDto | null>;
  update(id: string, roleDto: UpdateRoleDto, workspace: string): Promise<RoleResponseDto>;
  delete(id: string, workspace: string): Promise<void>;
}

