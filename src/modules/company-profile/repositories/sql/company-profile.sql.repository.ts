import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In, Like } from "typeorm";
import { CompanyProfileEntity } from "./company-profile.entity";
import { CreateCompanyProfileDto, UpdateCompanyProfileDto, CompanyProfileResponseDto } from "../../dto";
import { CompanyProfileRepository } from "../../company-profile.repository.interface";

@Injectable()
export class CompanyProfileSQLRepository implements CompanyProfileRepository {
  constructor(
    @InjectRepository(CompanyProfileEntity)
    private companyProfileRepository: Repository<CompanyProfileEntity>
  ) {}

  async create(companyProfileDto: CreateCompanyProfileDto): Promise<CompanyProfileResponseDto> {
    const savedCompanyProfile = await this.companyProfileRepository.save(companyProfileDto);
    return this.findById(savedCompanyProfile.id.toString());
  }

  async findById(id: string): Promise<CompanyProfileResponseDto> {
    const companyProfile = await this.companyProfileRepository.findOne({ where: { id: parseInt(id) } });
    if (!companyProfile) return null;
    return this.transformEntityToResponse(companyProfile);
  }

  async findByUserId(userId: string): Promise<CompanyProfileResponseDto> {
    const companyProfile = await this.companyProfileRepository.findOne({ where: { userId } });
    if (!companyProfile) return null;
    return this.transformEntityToResponse(companyProfile);
  }

  async update(id: string, companyProfileDto: Partial<UpdateCompanyProfileDto>): Promise<CompanyProfileResponseDto> {
    await this.companyProfileRepository.update(parseInt(id), companyProfileDto as any);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.companyProfileRepository.delete(parseInt(id));
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.companyProfileRepository.delete({ userId });
  }

  async findByUserIds(userIds: string[]): Promise<CompanyProfileResponseDto[]> {
    const companyProfiles = await this.companyProfileRepository.find({
      where: { userId: In(userIds) }
    });

    return companyProfiles.map(profile => this.transformEntityToResponse(profile));
  }

  async findByUsernameLike(username: string, page: number, limit: number): Promise<{ profiles: CompanyProfileResponseDto[], total: number }> {
    const [profiles, total] = await this.companyProfileRepository.findAndCount({
      where: { userName: Like(`%${username}%`) },
      skip: (page - 1) * limit,
      take: limit
    });

    return { profiles: profiles.map(profile => this.transformEntityToResponse(profile)), total };
  }

  private transformEntityToResponse(companyProfile: CompanyProfileEntity): CompanyProfileResponseDto {
    const bankData = companyProfile.bankData || [];
    
    const responseData = {
      ...companyProfile,
      _id: companyProfile.id.toString(),
      partners: companyProfile.partners || [],
      contacts: companyProfile.contacts || [],
      bankData: bankData || [],
      relatedFiles: companyProfile.relatedFiles || []
    };

    return new CompanyProfileResponseDto(responseData);
  }
} 