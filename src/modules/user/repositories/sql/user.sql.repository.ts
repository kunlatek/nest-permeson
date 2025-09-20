import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { UserEntity } from "./user.entity";
import { CreateUserDto, UpdateUserDto, UserResponseDto } from "../../dto";
import { UserRepository } from "../../user.repository.interface";

@Injectable()
export class UserSQLRepository implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}

  async create(userDto: CreateUserDto): Promise<UserResponseDto> {
    const user = this.userRepository.create(userDto);
    const savedUser = await this.userRepository.save(user);
    return this.transformEntityToResponse(savedUser);
  }

  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: parseInt(id), deletedAt: null }
    });

    if (!user) return null;

    return this.transformEntityToResponse(user);
  }

  async findByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { email, deletedAt: null }
    });

    if (!user) return null;

    return this.transformEntityToResponse(user);
  }

  async update(id: string, userDto: Partial<UpdateUserDto>): Promise<UserResponseDto> {
    await this.userRepository.update(parseInt(id), userDto);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    // Soft delete
    await this.userRepository.update(parseInt(id), { deletedAt: new Date() });
  }

  async findByEmails(emails: string[]): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({
      where: { email: In(emails), deletedAt: null }
    });

    return users.map(user => this.transformEntityToResponse(user));
  }

  async findVerifiedUsers(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({
      where: { verified: true, deletedAt: null }
    });

    return users.map(user => this.transformEntityToResponse(user));
  }

  private transformEntityToResponse(user: UserEntity): UserResponseDto {
    const responseData = {
      ...user,
      _id: user.id.toString()
    };

    return new UserResponseDto(responseData);
  }
} 