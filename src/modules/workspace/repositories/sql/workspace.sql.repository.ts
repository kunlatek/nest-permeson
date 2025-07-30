import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { WorkspaceEntity } from "./workspace.entity";
import { CreateWorkspaceDto, UpdateWorkspaceDto, WorkspaceResponseDto } from "../../dto";
import { WorkspaceRepository } from "../../workspace.repository.interface";

@Injectable()
export class WorkspaceSQLRepository implements WorkspaceRepository {
  constructor(
    @InjectRepository(WorkspaceEntity)
    private workspaceRepository: Repository<WorkspaceEntity>
  ) {}

  async create(workspaceDto: CreateWorkspaceDto): Promise<WorkspaceResponseDto> {
    const savedWorkspace = await this.workspaceRepository.save(workspaceDto);
    return this.findById(savedWorkspace.id.toString());
  }

  async findById(id: string): Promise<WorkspaceResponseDto> {
    const workspace = await this.workspaceRepository.findOne({ where: { id: parseInt(id) } });
    if (!workspace) return null;
    return this.transformEntityToResponse(workspace);
  }

  async findByOwner(owner: string): Promise<WorkspaceResponseDto> {
    const workspace = await this.workspaceRepository.findOne({ where: { owner } });
    if (!workspace) return null;
    return this.transformEntityToResponse(workspace);
  }

  async update(id: string, workspaceDto: Partial<UpdateWorkspaceDto>): Promise<WorkspaceResponseDto> {
    await this.workspaceRepository.update(parseInt(id), workspaceDto as any);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.workspaceRepository.delete(parseInt(id));
  }

  async findByTeamUser(userId: string): Promise<WorkspaceResponseDto[]> {
    const workspaces = await this.workspaceRepository.find({
      where: [
        { owner: userId },
        { team: In([userId]) }
      ]
    });

    return workspaces.map(workspace => this.transformEntityToResponse(workspace));
  }

  async addTeamUser(workspaceId: string, userId: string): Promise<WorkspaceResponseDto> {
    const workspace = await this.workspaceRepository.findOne({
      where: { id: parseInt(workspaceId) }
    });

    if (!workspace) {
      throw new Error(`Workspace with id ${workspaceId} not found`);
    }

    const currentTeam = workspace.team || [];
    if (!currentTeam.includes(userId)) {
      currentTeam.push(userId);
      await this.workspaceRepository.update(parseInt(workspaceId), { team: currentTeam });
    }

    return this.findById(workspaceId);
  }

  async removeTeamUser(workspaceId: string, userId: string): Promise<WorkspaceResponseDto> {
    const workspace = await this.workspaceRepository.findOne({
      where: { id: parseInt(workspaceId) }
    });

    if (!workspace) {
      throw new Error(`Workspace with id ${workspaceId} not found`);
    }

    const currentTeam = workspace.team || [];
    const updatedTeam = currentTeam.filter(id => id !== userId);
    await this.workspaceRepository.update(parseInt(workspaceId), { team: updatedTeam });

    return this.findById(workspaceId);
  }

  // Helper methods
  private transformEntityToResponse(workspace: WorkspaceEntity): WorkspaceResponseDto {
    const responseData = {
      ...workspace,
      _id: workspace.id.toString(),
      acl: workspace.acl || []
    };

    return new WorkspaceResponseDto(responseData);
  }
} 