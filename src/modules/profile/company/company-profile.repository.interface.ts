import { CreateCompanyProfileDto, CompanyProfileFilterDto, UpdateCompanyProfileDto } from "./dto";
import { CompanyProfile } from "./models/company-profile.model";

export interface CompanyProfileRepository {
  create(companyProfileDto: CreateCompanyProfileDto): Promise<CompanyProfile>;
  
  findById(id: string): Promise<CompanyProfile>;
  
  findByUserId(userId: string): Promise<CompanyProfile>;
  
  findAll(params: CompanyProfileFilterDto): Promise<CompanyProfile[]>;

  count(params: Partial<CompanyProfileFilterDto>): Promise<number>;
  
  update(id: string, companyProfileDto: UpdateCompanyProfileDto): Promise<CompanyProfile>;
  
  delete(id: string): Promise<void>;
}