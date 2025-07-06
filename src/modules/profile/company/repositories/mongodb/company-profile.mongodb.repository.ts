import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MongoDBCompanyProfile, CompanyProfileDocument } from "./company-profile.schema";
import { CreateCompanyProfileDto, CompanyProfileFilterDto, UpdateCompanyProfileDto } from "../../dto";
import { CompanyProfileRepository } from "../../company-profile.repository.interface";
import { CompanyProfileResponseDto } from "../../dto/company-profile-response.dto";

@Injectable()
export class CompanyProfileMongoDBRepository implements CompanyProfileRepository {
    constructor(
        @InjectModel(MongoDBCompanyProfile.name)
        private companyProfileModel: Model<CompanyProfileDocument>
    ) { }

    async create(companyProfileDto: CreateCompanyProfileDto): Promise<CompanyProfileResponseDto> {
        const createdCompanyProfile = new this.companyProfileModel(companyProfileDto);
        const savedCompanyProfile = await createdCompanyProfile.save();
        return new CompanyProfileResponseDto(savedCompanyProfile);
    }

    async findById(id: string): Promise<CompanyProfileResponseDto> {
        const companyProfile = await this.companyProfileModel.findById(id);
        return new CompanyProfileResponseDto(companyProfile);
    }

    async findByUserId(userId: string): Promise<CompanyProfileResponseDto> {
        const companyProfile = await this.companyProfileModel.findOne({ userId });
        return new CompanyProfileResponseDto(companyProfile);
    }

    async findAll(params: CompanyProfileFilterDto): Promise<CompanyProfileResponseDto[]> {
        const { page, limit, ...filters } = params;
        const companyProfiles = await this.companyProfileModel.find(filters).skip((page - 1) * limit).limit(limit);
        return companyProfiles.map(companyProfile => new CompanyProfileResponseDto(companyProfile));
    }

    async count(params: Partial<CompanyProfileFilterDto>): Promise<number> {
        return await this.companyProfileModel.countDocuments(params);
    }

    async update(id: string, companyProfileDto: Partial<UpdateCompanyProfileDto>): Promise<CompanyProfileResponseDto> {
        const updatedCompanyProfile = await this.companyProfileModel.findByIdAndUpdate(id, companyProfileDto, { new: true });
        return new CompanyProfileResponseDto(updatedCompanyProfile);
    }

    async delete(id: string): Promise<void> {
        await this.companyProfileModel.findByIdAndDelete(id);
    }
}