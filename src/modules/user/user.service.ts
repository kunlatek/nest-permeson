import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { CreateUserByInvitationDto, CreateUserDto } from './dto/create-user.dto';
import { UserRole } from 'src/enums/user-role.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { CascadeService } from 'src/common/services/cascade.service';
import { InvitationService } from '../invitation/invitation.service';
import { ErrorService } from 'src/common/services/error.service';
import { ErrorCode } from 'src/common/constants/error-code.enum';
import { UserRepository } from './user.repository.interface';
import { UserResponseDto } from './dto';
import { CompanyProfileService } from '../profile/company/company-profile.service';
import { PersonProfileService } from '../profile/person/person-profile.service';

@Injectable()
export class UserService {
  private readonly DAYS_UNTIL_HARD_DELETE = 90;

  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,

    private readonly companyProfileService: CompanyProfileService,
    private readonly personProfileService: PersonProfileService,

    private readonly cascadeService: CascadeService,
    private readonly invitationService: InvitationService,
    private readonly errorService: ErrorService,
  ) { }

  /**
   * Creates a new user, storing the password hashed.
   * Validates if the email already exists.
   */
  async createUser(payload: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findByEmail(payload.email);
    if (existingUser) {
      throw new UnauthorizedException(
        this.errorService.getErrorMessage(ErrorCode.EMAIL_IN_USE),
      );
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);
    const newUser = await this.userRepository.create({
      ...payload,
      password: hashedPassword,
    });

    return newUser;
  }

  /**
   * Creates a new user from an invitation.
   */
  async createUserByInvitation(payload: CreateUserByInvitationDto): Promise<UserResponseDto> {
    try {
      const invitationPayload: any = jwt.verify(payload.token, process.env.JWT_SECRET);

      if (invitationPayload.email !== payload.email) {
        throw new BadRequestException('Email does not match invitation email');
      }

      const invitation = await this.invitationService.findByEmail(invitationPayload.email);
      if (!invitation) {
        throw new NotFoundException('Invitation not found');
      }

      if (invitation.accepted) {
        throw new BadRequestException('Invitation already accepted');
      }

      const existingUser = await this.userRepository.findByEmail(payload.email);
      if (existingUser) {
        throw new UnauthorizedException(
          this.errorService.getErrorMessage(ErrorCode.EMAIL_IN_USE),
        );
      }

      const hashedPassword = await bcrypt.hash(payload.password, 10);
      console.log(hashedPassword);
      const newUser = await this.userRepository.create({
        email: invitationPayload.email,
        password: hashedPassword,
      });

      await this.invitationService.acceptInvitation(invitation._id);

      return newUser;
    } catch (error) {
      throw new BadRequestException(`Failed to create user: ${error.message}`);
    }
  }

  /**
   * Finds a user by email and verifies if the password matches.
   * Returns null if it does not match or if user not found.
   */
  async validateUser(
    email: string,
    password: string,
  ): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return null;
    }

    return user;
  }

  /**
   * Utility method to find user by ID.
   */
  async findById(userId: string): Promise<UserResponseDto | null> {
    return this.userRepository.findById(userId);
  }

  /**
   * Finds a user by email.
   */
  async findByEmail(email: string): Promise<UserResponseDto | null> {
    return this.userRepository.findByEmail(email);
  }

  /**
   * Creates a user from an external provider (e.g., Google).
   * This skips password validation and stores only provider metadata.
   */
  async createWithProvider(data: {
    email: string;
    provider: string;
    providerId: string;
    profilePicture?: string;
  }): Promise<UserResponseDto> {
    throw new Error('Not implemented');
    // const newUser = await this.userRepository.create({
    //   email: data.email,
    //   provider: data.provider,
    //   providerId: data.providerId,
    //   profilePicture: data.profilePicture,
    // });

    // return newUser.save();
  }

  /**
   * Returns all roles available to a given user based on their associated profiles.
   */
  async getAvailableRoles(userId: string): Promise<UserRole[]> {
    const roles: UserRole[] = [];

    const normalizedUserId = userId;

    const [company, person] = await Promise.all([
      this.companyProfileService.findByUserId(normalizedUserId),
      this.personProfileService.findByUserId(normalizedUserId),
    ]);

    if (company) roles.push(UserRole.COMPANY);
    if (person) roles.push(UserRole.PERSON);

    return roles;
  }

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

  async findAll(): Promise<UserResponseDto[]> {
    return this.userRepository.findAll({});
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user || user.deletedAt) {
      throw new NotFoundException('User not found or has been deleted');
    }
    return user;
  }

  async findMe(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updatePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user || user.deletedAt) {
      throw new NotFoundException('User not found or has been deleted');
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid old password');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(userId, { password: hashedPassword });
  }

  async userHasProfile(userId: string): Promise<{ company: boolean; person: boolean }> {
    const company = await this.companyProfileService.findByUserId(userId);
    const person = await this.personProfileService.findByUserId(userId);
    return { company: !!company, person: !!person };
  }
}
