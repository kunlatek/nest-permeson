import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MongoDBUser, UserDocument } from "./user.schema";
import { UserRepository } from "../../user.repository.interface";
import { CreateUserDto, UserResponseDto, UpdateUserDto } from "../../dto";

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
    const user = await this.userModel.findById(id).lean();
    if (!user) return null;
    return new UserResponseDto(user);
  }

  async findByEmail(email: string): Promise<UserResponseDto | null> {
    const user = await this.userModel.findOne({ email }).lean();
    if (!user) return null;
    return new UserResponseDto(user);
  }

  async update(id: string, userDto: Partial<UpdateUserDto>): Promise<UserResponseDto> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, userDto, { new: true }).lean();
    return new UserResponseDto(updatedUser);
  }

  async delete(id: string): Promise<void> {
    await this.userModel.updateOne({ _id: id }, { deletedAt: new Date() }).lean();
  }
}