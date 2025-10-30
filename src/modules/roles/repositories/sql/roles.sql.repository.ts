import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like } from "typeorm";
import { RoleEntity } from "./role.entity";
import { RolesRepository } from "../../roles.repository.interface";
import { CreateRoleDto, UpdateRoleDto, RoleResponseDto } from "../../dto";
import { Role } from "../../models";

@Injectable()
export class RolesSQLRepository implements RolesRepository {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>
  ) {}

  async create(roleDto: CreateRoleDto, workspace: string, createdBy: string): Promise<RoleResponseDto> {
    const role = this.roleRepository.create({
      name: roleDto.name,
      permissions: roleDto.permissions,
      workspace,
      createdBy,
    });

    const savedRole = await this.roleRepository.save(role);
    return this.mapToRoleResponseDto(savedRole);
  }

  async findAll(
    workspace: string,
    page?: number,
    limit?: number,
    filters?: any[],
  ): Promise<{ roles: RoleResponseDto[]; total: number }> {
    const whereConditions: any = { workspace };

    if (filters) {
      filters.forEach(filter => {
        const key = Object.keys(filter)[0];
        const value = filter[key];
        whereConditions[key] = Like(`%${value}%`);
      });
    }

    if (page !== undefined && limit !== undefined) {
      const skip = (page - 1) * limit;
      const [roles, total] = await this.roleRepository.findAndCount({
        where: whereConditions,
        skip,
        take: limit,
        order: { createdAt: 'DESC' },
      });

      return {
        roles: roles.map(role => this.mapToRoleResponseDto(role)),
        total,
      };
    }

    const roles = await this.roleRepository.find({
      where: whereConditions,
      order: { createdAt: 'DESC' },
    });

    return {
      roles: roles.map(role => this.mapToRoleResponseDto(role)),
      total: roles.length,
    };
  }

  async findById(id: string, workspace: string): Promise<RoleResponseDto | null> {
    const role = await this.roleRepository.findOne({
      where: [
        { id: parseInt(id), workspace },
        { _id: id, workspace },
      ],
    });

    if (!role) {
      return null;
    }

    return this.mapToRoleResponseDto(role);
  }

  async update(id: string, roleDto: UpdateRoleDto, workspace: string): Promise<RoleResponseDto> {
    const role = await this.roleRepository.findOne({
      where: [
        { id: parseInt(id), workspace },
        { _id: id, workspace },
      ],
    });

    if (!role) {
      throw new Error('Role not found');
    }

    Object.assign(role, roleDto);
    const updatedRole = await this.roleRepository.save(role);
    return this.mapToRoleResponseDto(updatedRole);
  }

  async delete(id: string, workspace: string): Promise<void> {
    const role = await this.roleRepository.findOne({
      where: [
        { id: parseInt(id), workspace },
        { _id: id, workspace },
      ],
    });

    if (!role) {
      throw new Error('Role not found');
    }

    await this.roleRepository.remove(role);
  }

  private mapToRoleResponseDto(roleEntity: RoleEntity): RoleResponseDto {
    const role = new Role({
      name: roleEntity.name,
      permissions: roleEntity.permissions as any,
      workspace: roleEntity.workspace,
      createdBy: roleEntity.createdBy,
      createdAt: roleEntity.createdAt?.toISOString(),
      updatedAt: roleEntity.updatedAt?.toISOString(),
    });

    return new RoleResponseDto(
      roleEntity._id || roleEntity.id.toString(),
      role
    );
  }
}

