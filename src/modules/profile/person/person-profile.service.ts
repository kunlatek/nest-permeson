import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { PersonProfile } from './models/person-profile.model';
import {
  CreatePersonProfileDto,
  UpdatePersonProfileDto,
  PersonProfileFilterDto,
} from './dto';
import { ErrorService } from 'src/common/services/error.service';
import { AuthService } from 'src/modules/auth/auth.service';
import { UserRole } from 'src/enums/user-role.enum';
import { ErrorCode } from 'src/common/constants/error-code.enum';

import { PersonProfileRepository } from './interfaces';

@Injectable()
export class PersonProfileService {
  constructor(
    @Inject('PersonProfileRepository')
    private readonly personProfileRepository: PersonProfileRepository,
    
    private readonly errorService: ErrorService,
    private readonly authService: AuthService,
  ) {}

  async createProfile(dto: CreatePersonProfileDto): Promise<{ profile: PersonProfile; token: string }> {
    const existing = await this.personProfileRepository.findByUserId(dto.userId);
    if (existing) {
      throw new ConflictException('User already has a person profile');
    }

    const age = this.calculateAge(dto.birthday);
    if (age < 18) {
      throw new BadRequestException(
        this.errorService.getErrorMessage(ErrorCode.MINIMUM_AGE_REQUIRED),
      );
    }

    const profile = await this.personProfileRepository.create(dto);
    const {access_token: token} = await this.authService.issueTokenWithRole(
      dto.userId,
      UserRole.PERSON,
    );

    return { profile, token };
  }

  async findAll(
    filterDto: PersonProfileFilterDto,
  ): Promise<{ data: PersonProfile[]; total: number }> {
    const { page = 1, limit = 10, ...filters } = filterDto;
    const query: any = {};

    for (const key of Object.keys(filters)) {
      if (filters[key]) {
        query[key] = { $regex: filters[key], $options: 'i' };
      }
    }

    const total = await this.personProfileRepository.count(query);
    const data = await this.personProfileRepository.findAll({ page, limit, ...query });

    return { data, total };
  }

  async findProfileById(id: string): Promise<PersonProfile> {
    const profile = await this.personProfileRepository.findById(id);
    if (!profile) throw new NotFoundException('Person profile not found');
    return profile;
  }

  async findProfileByUserId(userId: string): Promise<PersonProfile> {
    const profile = await this.personProfileRepository.findByUserId(userId);
    if (!profile) throw new NotFoundException('Person profile not found');
    return profile;
  }

  async updateProfile(id: string, dto: UpdatePersonProfileDto, userId: string): Promise<PersonProfile> {
    const profile = await this.personProfileRepository.findById(id);
    if (!profile) throw new NotFoundException('Person profile not found');

    if (profile.userId.toString() !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to update this profile',
      );
    }

    if (dto.birthday) {
      const age = this.calculateAge(dto.birthday);
      if (age < 18) {
        throw new BadRequestException(
          this.errorService.getErrorMessage(ErrorCode.MINIMUM_AGE_REQUIRED),
        );
      }
    }

    return await this.personProfileRepository.update(id, dto);
  }

  async deleteProfile(id: string, userId: string): Promise<void> {
    const profile = await this.personProfileRepository.findById(id);
    if (!profile) throw new NotFoundException('Person profile not found');

    if (profile.userId.toString() !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this profile',
      );
    }

    await this.personProfileRepository.delete(id);
  }

  private calculateAge(date: Date): number {
    const today = new Date();
    const birth = new Date(date);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  }
}
