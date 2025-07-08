import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MongoDBUser, UserDocument } from "./user.schema";
import { UserRepository } from "../../user.repository.interface";
import { CreateUserDto, UserFilterDto, UserResponseDto, UpdateUserDto } from "../../dto";

@Injectable()
export class UserMongoDBRepository implements UserRepository {
  constructor(
    @InjectModel(MongoDBUser.name)
    private userModel: Model<UserDocument>) { }

  async create(userDto: CreateUserDto): Promise<UserResponseDto> {
    const createdUser = new this.userModel(userDto);
    const savedUser = await createdUser.save();
    return new UserResponseDto(savedUser);
  }

  async findById(id: string): Promise<UserResponseDto | null> {
    const user = await this.userModel.findById(id);
    if (!user) return null;
    return new UserResponseDto(user);
  }

  async findByIdAndOwnerId(id: string, ownerId: string): Promise<UserResponseDto | null> {
    const user = await this.userModel.findOne({ _id: id, ownerId });
    if (!user) return null;
    return new UserResponseDto(user);
  }

  async findByEmail(email: string): Promise<UserResponseDto | null> {
    const user = await this.userModel.findOne({ email });
    if (!user) return null;
    return new UserResponseDto(user);
  }

  async findAll(params: UserFilterDto): Promise<UserResponseDto[]> {
    const { page, limit, ...filters } = params;
    const users = await this.userModel.find(filters).skip((page - 1) * limit).limit(limit);
    return users.map(user => new UserResponseDto(user));
  }

  async count(params: Partial<UserFilterDto>): Promise<number> {
    return await this.userModel.countDocuments(params);
  }

  async update(id: string, userDto: Partial<UpdateUserDto>): Promise<UserResponseDto> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, userDto, { new: true });
    return new UserResponseDto(updatedUser);
  }

  async delete(id: string): Promise<void> {
    await this.userModel.updateOne({ _id: id }, { deletedAt: new Date() });
  }
}