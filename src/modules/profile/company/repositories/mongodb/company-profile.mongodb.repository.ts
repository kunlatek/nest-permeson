import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MongoDBCompanyProfile, CompanyProfileDocument } from "./company-profile.schema";
import { CreateCompanyProfileDto, CompanyProfileFilterDto, UpdateCompanyProfileDto } from "../../dto";
import { CompanyProfile } from "../../models/company-profile.model";
import { CompanyProfileRepository } from "../../company-profile.repository.interface";

@Injectable()
export class CompanyProfileMongoDBRepository implements CompanyProfileRepository {
    constructor(
        @InjectModel(MongoDBCompanyProfile.name)
        private companyProfileModel: Model<CompanyProfileDocument>
    ) { }

    async create(companyProfileDto: CreateCompanyProfileDto): Promise<CompanyProfile> {
        const createdCompanyProfile = new this.companyProfileModel(companyProfileDto);
        const savedCompanyProfile = await createdCompanyProfile.save();
        return new CompanyProfile(savedCompanyProfile);
    }

    async findById(id: string): Promise<CompanyProfile> {
        const companyProfile = await this.companyProfileModel.findById(id);
        return new CompanyProfile(companyProfile);
    }

    async findByUserId(userId: string): Promise<CompanyProfile> {
        const companyProfile = await this.companyProfileModel.findOne({ userId });
        return new CompanyProfile(companyProfile);
    }

    async findAll(params: CompanyProfileFilterDto): Promise<CompanyProfile[]> {
        const { page, limit, ...filters } = params;
        const companyProfiles = await this.companyProfileModel.find(filters).skip((page - 1) * limit).limit(limit);
        return companyProfiles.map(companyProfile => new CompanyProfile(companyProfile));
    }

    async count(params: Partial<CompanyProfileFilterDto>): Promise<number> {
        return await this.companyProfileModel.countDocuments(params);
    }

    async update(id: string, companyProfileDto: UpdateCompanyProfileDto): Promise<CompanyProfile> {
        const updatedCompanyProfile = await this.companyProfileModel.findByIdAndUpdate(id, companyProfileDto, { new: true });
        return new CompanyProfile(updatedCompanyProfile);
    }

    async delete(id: string): Promise<void> {
        await this.companyProfileModel.findByIdAndDelete(id);
    }
}