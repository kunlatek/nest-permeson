import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CascadeService } from 'src/common/services/cascade.service';
import { ErrorService } from 'src/common/services/error.service';
import { ErrorCodeEnum } from 'src/enums/error-code.enum';
import { UserRepository } from './user.repository.interface';
import { UserResponseDto } from './dto';

@Injectable()
export class UserService {
  private readonly DAYS_UNTIL_HARD_DELETE = 90;

  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,

    private readonly cascadeService: CascadeService,
    private readonly errorService: ErrorService,
  ) { }

  async createUser(payload: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findByEmail(payload.email);
    if (existingUser) {
      throw new UnauthorizedException(
        this.errorService.getErrorMessage(ErrorCodeEnum.EMAIL_IN_USE),
      );
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);
    const newUser = await this.userRepository.create({
      ...payload,
      password: hashedPassword,
    });

    return newUser;
  }

  async findByEmail(email: string): Promise<UserResponseDto | null> {
    return this.userRepository.findByEmail(email);
  }

  // async createWithProvider(data: {
  //   email: string;
  //   provider: string;
  //   providerId: string;
  //   profilePicture?: string;
  // }): Promise<UserResponseDto> {
  //   throw new Error('Not implemented');
  //   const newUser = await this.userRepository.create({
  //     email: data.email,
  //     provider: data.provider,
  //     providerId: data.providerId,
  //     profilePicture: data.profilePicture,
  //   });

  //   return newUser.save();
  // }

  async updateUser(id: string, payload: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user || user.deletedAt) {
      throw new NotFoundException('User not found or has been deleted');
    }

    if (payload.password) {
      payload.password = await bcrypt.hash(payload.password, 10);
    }

    Object.assign(user, payload);
    return this.userRepository.update(id, payload);
  }

  async softDeleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user || user.deletedAt) {
      throw new NotFoundException('User not found or has been deleted');
    }

    await this.userRepository.update(id, { deletedAt: new Date() });

    // Cascade soft delete to all related documents
    await this.cascadeService.cascadeSoftDelete(id);

    // Schedule hard delete after 90 days if user remains soft deleted
    setTimeout(async () => {
      const user = await this.userRepository.findById(id);
      if (user?.deletedAt) {
        const daysSinceDelete = Math.floor(
          (Date.now() - user.deletedAt.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysSinceDelete >= this.DAYS_UNTIL_HARD_DELETE) {
          await this.hardDeleteUser(id);
        }
      }
    }, this.DAYS_UNTIL_HARD_DELETE * 24 * 60 * 60 * 1000);
  }

  async hardDeleteUser(id: string): Promise<void> {
    // Cascade hard delete to all related documents first
    await this.cascadeService.cascadeHardDelete(id);

    // Then delete the user
    await this.userRepository.delete(id);
  }

  async restoreUser(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user || !user.deletedAt) {
      throw new NotFoundException('User not found or is not deleted');
    }

    await this.userRepository.update(id, { deletedAt: null });

    // Cascade restore to all related documents
    await this.cascadeService.cascadeRestore(id);

    return user;
  }
}
