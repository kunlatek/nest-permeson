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
        const companyProfile = await this.companyProfileModel.findById(id).lean();
        return new CompanyProfileResponseDto(companyProfile);
    }

    async findByUserId(userId: string): Promise<CompanyProfileResponseDto> {
        const companyProfile = await this.companyProfileModel.findOne({ userId }).lean();
        return new CompanyProfileResponseDto(companyProfile);
    }

    async update(id: string, companyProfileDto: Partial<UpdateCompanyProfileDto>): Promise<CompanyProfileResponseDto> {
        const updatedCompanyProfile = await this.companyProfileModel.findByIdAndUpdate(id, companyProfileDto, { new: true }).lean();
        return new CompanyProfileResponseDto(updatedCompanyProfile);
    }

    async delete(id: string): Promise<void> {
        await this.companyProfileModel.findByIdAndDelete(id);
    }

    async deleteByUserId(userId: string): Promise<void> {
        await this.companyProfileModel.deleteMany({ userId });
    }

    async findByUserIds(userIds: string[]): Promise<CompanyProfileResponseDto[]> {
        const companyProfiles = await this.companyProfileModel.find({ userId: { $in: userIds } }).lean();
        return companyProfiles.map((companyProfile) => new CompanyProfileResponseDto(companyProfile));
    }

    async findByUsernameLike(username: string, page: number, limit: number): Promise<{ profiles: CompanyProfileResponseDto[], total: number }> {
        const skip = (page - 1) * limit;
        
        const total = await this.companyProfileModel.countDocuments({
            userName: { $regex: username, $options: 'i' }
        });
        
        const profiles = await this.companyProfileModel.find({
            userName: { $regex: username, $options: 'i' }
        })
        .select('userId userName')
        .skip(skip)
        .limit(limit)
        .lean();
        
        return {
            profiles: profiles.map((profile) => new CompanyProfileResponseDto(profile)),
            total
        };
    }
}