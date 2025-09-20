import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MongoDBPersonProfile, PersonProfileDocument } from "./person-profile.schema";
import { CreatePersonProfileDto, UpdatePersonProfileDto, PersonProfileResponseDto } from "../../dto";
import { PersonProfileRepository } from "../../person-profile.repository.interface";

@Injectable()
export class PersonProfileMongoDBRepository implements PersonProfileRepository {
  constructor(
    @InjectModel(MongoDBPersonProfile.name) 
    private personProfileModel: Model<PersonProfileDocument>) {}

    async create(personProfileDto: CreatePersonProfileDto): Promise<PersonProfileResponseDto> {
        const createdPersonProfile = new this.personProfileModel(personProfileDto);
        const savedPersonProfile = await createdPersonProfile.save();
        return new PersonProfileResponseDto(savedPersonProfile);
    }

    async findById(id: string): Promise<PersonProfileResponseDto> {
        const personProfile = await this.personProfileModel.findById(id).lean();
        return new PersonProfileResponseDto(personProfile);
    }

    async findByUserId(userId: string): Promise<PersonProfileResponseDto> {
        const personProfile = await this.personProfileModel.findOne({ userId }).lean();
        return new PersonProfileResponseDto(personProfile);
    }

    async update(id: string, personProfileDto: Partial<UpdatePersonProfileDto>): Promise<PersonProfileResponseDto> {
        const updatedPersonProfile = await this.personProfileModel.findByIdAndUpdate(id, personProfileDto, { new: true }).lean();
        return new PersonProfileResponseDto(updatedPersonProfile);
    }

    async delete(id: string): Promise<void> {
        await this.personProfileModel.findByIdAndDelete(id);
    }

    async deleteByUserId(userId: string): Promise<void> {
        await this.personProfileModel.deleteMany({ userId });
    }

    async findByUserIds(userIds: string[]): Promise<PersonProfileResponseDto[]> {
        const personProfiles = await this.personProfileModel.find({ userId: { $in: userIds } }).lean();
        return personProfiles.map((personProfile) => new PersonProfileResponseDto(personProfile));
    }

    async findByUsernameLike(username: string, page: number, limit: number): Promise<{ profiles: PersonProfileResponseDto[], total: number }> {
        const skip = (page - 1) * limit;
        
        const total = await this.personProfileModel.countDocuments({
            userName: { $regex: username, $options: 'i' }
        });
        
        const profiles = await this.personProfileModel.find({
            userName: { $regex: username, $options: 'i' }
        })
        .select('userId userName')
        .skip(skip)
        .limit(limit)
        .lean();
        
        return {
            profiles: profiles.map((profile) => new PersonProfileResponseDto(profile)),
            total
        };
    }
}