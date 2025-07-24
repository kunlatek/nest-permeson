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
        const workspaces = await this.workspaceModel.find({ team: { $in: [teamUser] } }).lean();
        return workspaces.map((workspace) => new WorkspaceResponseDto(workspace));
    }
}