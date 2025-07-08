import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { CompanyProfileResponseDto } from './dto/company-profile-response.dto';
import {
  CompanyProfileFilterDto,
  CreateCompanyProfileDto,
  UpdateCompanyProfileDto,
} from './dto';
import { ErrorService } from '../../../common/services/error.service';
import { ErrorCode } from '../../../common/constants/error-code.enum';
import { AuthService } from '../../auth/auth.service';
import { UserRole } from '../../../enums/user-role.enum';
import { CompanyProfileRepository } from './company-profile.repository.interface';

@Injectable()
export class CompanyProfileService {
  constructor(
    @Inject('CompanyProfileRepository')
    private readonly companyProfileRepository: CompanyProfileRepository,

    private readonly errorService: ErrorService,
  ) {}

  async createProfile(createCompanyProfileDto: CreateCompanyProfileDto): Promise<CompanyProfileResponseDto> {
    console.log(
      '🔹 Creating company profile for user:',
      createCompanyProfileDto.userId,
    );

    const existingProfile = await this.companyProfileRepository.findByUserId(
      createCompanyProfileDto.userId,
    );

    if (existingProfile) {
      throw new ConflictException(
        this.errorService.getErrorMessage(ErrorCode.PROFILE_ALREADY_EXISTS),
      );
    }

    return await this.companyProfileRepository.create(createCompanyProfileDto);
  }

  async findAll(
    filterDto: CompanyProfileFilterDto,
  ): Promise<{ data: CompanyProfileResponseDto[]; total: number }> {
    const { page = 1, limit = 10, ...filters } = filterDto;
    const query: any = {};

    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        query[key] = { $regex: filters[key], $options: 'i' };
      }
    });

    const total = await this.companyProfileRepository.count(query);
    const data = await this.companyProfileRepository.findAll({ page, limit, ...query });

    return { data, total };
  }

  async findProfileById(id: string): Promise<CompanyProfileResponseDto> {
    const profile = await this.companyProfileRepository.findById(id);
    if (!profile) {
      throw new NotFoundException(
        this.errorService.getErrorMessage(ErrorCode.PROFILE_NOT_FOUND),
      );
    }
    return profile;
  }

  async findProfileByUserId(userId: string): Promise<CompanyProfileResponseDto> {
    const profile = await this.companyProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException(
        this.errorService.getErrorMessage(ErrorCode.PROFILE_NOT_FOUND),
      );
    }
    return profile;
  }

  async updateProfile(
    id: string,
    updateCompanyProfileDto: UpdateCompanyProfileDto,
    userId: string,
  ): Promise<CompanyProfileResponseDto> {
    const profile = await this.companyProfileRepository.findById(id);

    if (!profile) {
      throw new NotFoundException(
        this.errorService.getErrorMessage(ErrorCode.PROFILE_NOT_FOUND),
      );
    }

    if (profile.userId !== userId) {
      throw new UnauthorizedException(
        this.errorService.getErrorMessage(ErrorCode.UNAUTHORIZED),
      );
    }

    return await this.companyProfileRepository.update(
      id,
      updateCompanyProfileDto,
    );
  }

  async deleteProfile(id: string, userId: string): Promise<void> {
    const profile = await this.companyProfileRepository.findById(id);

    if (!profile) {
      throw new NotFoundException(
        this.errorService.getErrorMessage(ErrorCode.PROFILE_NOT_FOUND),
      );
    }

    if (profile.userId !== userId) {
      throw new UnauthorizedException(
        this.errorService.getErrorMessage(ErrorCode.UNAUTHORIZED),
      );
    }

    await this.companyProfileRepository.delete(id);
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.companyProfileRepository.deleteByUserId(userId);
  }

  async findByUserId(userId: string): Promise<CompanyProfileResponseDto | null> {
    return await this.companyProfileRepository.findByUserId(userId);
  }
}
