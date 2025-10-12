import { CreateWorkspaceDto, UpdateWorkspaceDto, WorkspaceResponseDto } from "./dto";
import { ACL } from "./models";

export interface WorkspaceRepository {
  create(workspaceDto: CreateWorkspaceDto): Promise<WorkspaceResponseDto>;

  update(id: string, workspaceDto: UpdateWorkspaceDto): Promise<WorkspaceResponseDto>;

  delete(id: string): Promise<void>;

  findById(id: string): Promise<WorkspaceResponseDto>;

  findByOwner(owner: string): Promise<WorkspaceResponseDto>;
  
  findByTeamUser(teamUser: string): Promise<WorkspaceResponseDto[]>;

  addTeamUser(workspaceId: string, userId: string): Promise<WorkspaceResponseDto>;

  removeTeamUser(workspaceId: string, userId: string): Promise<WorkspaceResponseDto>;

  addAcl(workspaceId: string, acl: ACL): Promise<WorkspaceResponseDto>;

  removeAcl(workspaceId: string, userId: string): Promise<WorkspaceResponseDto>;

  updateAcl(workspaceId: string, userId: string, roleId: string): Promise<WorkspaceResponseDto>;
}