import { CreateWorkspaceDto, UpdateWorkspaceDto, WorkspaceResponseDto } from "./dto";

export interface WorkspaceRepository {
  create(workspaceDto: CreateWorkspaceDto): Promise<WorkspaceResponseDto>;

  update(id: string, workspaceDto: UpdateWorkspaceDto): Promise<WorkspaceResponseDto>;

  delete(id: string): Promise<void>;

  findById(id: string): Promise<WorkspaceResponseDto>;

  findByOwner(owner: string): Promise<WorkspaceResponseDto>;
  
  findByTeamUser(teamUser: string): Promise<WorkspaceResponseDto[]>;
}