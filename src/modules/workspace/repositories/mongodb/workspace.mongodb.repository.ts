import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MongoDBWorkspace } from "./workspace.schema";

import { WorkspaceRepository } from "../../workspace.repository.interface";
import { Injectable } from "@nestjs/common";
import { CreateWorkspaceDto, UpdateWorkspaceDto, WorkspaceResponseDto } from "../../dto";

@Injectable()
export class WorkspaceMongoDBRepository implements WorkspaceRepository {
  constructor(
    @InjectModel(MongoDBWorkspace.name)
    private workspaceModel: Model<MongoDBWorkspace>) {}

    async create(workspaceDto: CreateWorkspaceDto): Promise<WorkspaceResponseDto> {
        const createdWorkspace = new this.workspaceModel(workspaceDto);
        const savedWorkspace = await createdWorkspace.save();
        return new WorkspaceResponseDto(savedWorkspace);
    }

    async update(id: string, workspaceDto: UpdateWorkspaceDto): Promise<WorkspaceResponseDto> {
        const updatedWorkspace = await this.workspaceModel.findByIdAndUpdate(id, workspaceDto, { new: true });
        return new WorkspaceResponseDto(updatedWorkspace);
    }

    async delete(id: string): Promise<void> {
        await this.workspaceModel.findByIdAndDelete(id);
    }

    async findById(id: string): Promise<WorkspaceResponseDto> {
        const workspace = await this.workspaceModel.findById(id).lean();
        return new WorkspaceResponseDto(workspace);
    }

    async findByOwner(owner: string): Promise<WorkspaceResponseDto> {
        const workspace = await this.workspaceModel.findOne({ owner }).lean();
        return new WorkspaceResponseDto(workspace);
    }

    async findByTeamUser(teamUser: string): Promise<WorkspaceResponseDto[]> {
        // Find workspaces where the user is either the owner or a member of the team
        const workspaces = await this.workspaceModel.find({
            $or: [
                { owner: teamUser },
                { team: teamUser } // This will find workspaces where teamUser is in the team array
            ]
        }).lean();
        return workspaces.map((workspace) => new WorkspaceResponseDto(workspace));
    }

    async addTeamUser(workspaceId: string, userId: string): Promise<WorkspaceResponseDto> {
        const workspace = await this.workspaceModel.findById(workspaceId);
        if (!workspace) {
            throw new Error(`Workspace with id ${workspaceId} not found`);
        }

        const currentTeam = workspace.team || [];
        if (!currentTeam.includes(userId)) {
            currentTeam.push(userId);
            await this.workspaceModel.findByIdAndUpdate(workspaceId, { team: currentTeam });
        }

        return this.findById(workspaceId);
    }

    async removeTeamUser(workspaceId: string, userId: string): Promise<WorkspaceResponseDto> {
        const workspace = await this.workspaceModel.findById(workspaceId);
        if (!workspace) {
            throw new Error(`Workspace with id ${workspaceId} not found`);
        }

        const currentTeam = workspace.team || [];
        const updatedTeam = currentTeam.filter(id => id !== userId);
        await this.workspaceModel.findByIdAndUpdate(workspaceId, { team: updatedTeam });

        return this.findById(workspaceId);
    }
}