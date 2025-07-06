import { CreateCompanyProfileDto, CompanyProfileFilterDto, UpdateCompanyProfileDto, CompanyProfileResponseDto } from "./dto";

export interface CompanyProfileRepository {
  create(companyProfileDto: CreateCompanyProfileDto): Promise<CompanyProfileResponseDto>;
  
  findById(id: string): Promise<CompanyProfileResponseDto>;
  
  findByUserId(userId: string): Promise<CompanyProfileResponseDto>;
  
  findAll(params: CompanyProfileFilterDto): Promise<CompanyProfileResponseDto[]>;

  count(params: Partial<CompanyProfileFilterDto>): Promise<number>;
  
  update(id: string, companyProfileDto: Partial<UpdateCompanyProfileDto>): Promise<CompanyProfileResponseDto>;
  
  delete(id: string): Promise<void>;
}