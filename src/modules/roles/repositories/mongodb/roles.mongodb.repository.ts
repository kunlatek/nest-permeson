import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MongoDBRole, RoleDocument } from "./role.schema";
import { RolesRepository } from "../../roles.repository.interface";
import { CreateRoleDto, UpdateRoleDto, RoleResponseDto } from "../../dto";
import { Role } from "../../models";

@Injectable()
export class RolesMongoDBRepository implements RolesRepository {
  constructor(
    @InjectModel(MongoDBRole.name)
    private readonly roleModel: Model<RoleDocument>
  ) {}

  async create(roleDto: CreateRoleDto, workspace: string, createdBy: string): Promise<RoleResponseDto> {
    const role = new this.roleModel({
      name: roleDto.name,
      permissions: roleDto.permissions,
      workspace,
      createdBy,
    });

    const savedRole = await role.save();
    return this.mapToRoleResponseDto(savedRole);
  }

  async findAll(
    workspace: string,
    page?: number,
    limit?: number,
    name?: string,
  ): Promise<{ roles: RoleResponseDto[]; total: number }> {
    const query: any = { workspace };

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (page !== undefined && limit !== undefined) {
      const skip = (page - 1) * limit;
      const [roles, total] = await Promise.all([
        this.roleModel
          .find(query)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .exec(),
        this.roleModel.countDocuments(query).exec(),
      ]);

      return {
        roles: roles.map(role => this.mapToRoleResponseDto(role)),
        total,
      };
    }

    const roles = await this.roleModel
      .find(query)
      .sort({ createdAt: -1 })
      .exec();

    return {
      roles: roles.map(role => this.mapToRoleResponseDto(role)),
      total: roles.length,
    };
  }

  async findById(id: string, workspace: string): Promise<RoleResponseDto | null> {
    const role = await this.roleModel.findOne({ _id: id, workspace }).exec();

    if (!role) {
      return null;
    }

    return this.mapToRoleResponseDto(role);
  }

  async update(id: string, roleDto: UpdateRoleDto, workspace: string): Promise<RoleResponseDto> {
    const role = await this.roleModel.findOneAndUpdate(
      { _id: id, workspace },
      { $set: roleDto },
      { new: true }
    ).exec();

    if (!role) {
      throw new Error('Role not found');
    }

    return this.mapToRoleResponseDto(role);
  }

  async delete(id: string, workspace: string): Promise<void> {
    const result = await this.roleModel.deleteOne({ _id: id, workspace }).exec();

    if (result.deletedCount === 0) {
      throw new Error('Role not found');
    }
  }

  private mapToRoleResponseDto(roleDocument: RoleDocument): RoleResponseDto {
    const role = new Role({
      name: roleDocument.name,
      permissions: roleDocument.permissions as any,
      workspace: roleDocument.workspace,
      createdBy: roleDocument.createdBy,
      createdAt: roleDocument.createdAt?.toISOString(),
      updatedAt: roleDocument.updatedAt?.toISOString(),
    });

    return new RoleResponseDto(roleDocument._id.toString(), role);
  }
}

