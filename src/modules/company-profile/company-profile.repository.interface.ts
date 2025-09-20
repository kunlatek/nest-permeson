import { CreateCompanyProfileDto, CompanyProfileFilterDto, UpdateCompanyProfileDto, CompanyProfileResponseDto } from "./dto";

export interface CompanyProfileRepository {
  create(companyProfileDto: CreateCompanyProfileDto): Promise<CompanyProfileResponseDto>;
  
  findById(id: string): Promise<CompanyProfileResponseDto>;
  
  findByUserId(userId: string): Promise<CompanyProfileResponseDto>;
  
  update(id: string, companyProfileDto: Partial<UpdateCompanyProfileDto>): Promise<CompanyProfileResponseDto>;
  
  delete(id: string): Promise<void>;

  deleteByUserId(userId: string): Promise<void>;

  findByUserIds(userIds: string[]): Promise<CompanyProfileResponseDto[]>;
  
  findByUsernameLike(username: string, page: number, limit: number): Promise<{ profiles: CompanyProfileResponseDto[], total: number }>;
}