import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MongoDBPersonProfile, PersonProfileDocument } from "./person-profile.schema";
import { CreatePersonProfileDto, PersonProfileFilterDto, UpdatePersonProfileDto } from "../../dto";
import { PersonProfileRepository } from "../../interfaces";
import { PersonProfileResponseDto } from "../../dto/person-profile-response.dto";

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
        const personProfile = await this.personProfileModel.findById(id);
        return new PersonProfileResponseDto(personProfile);
    }

    async findByUserId(userId: string): Promise<PersonProfileResponseDto> {
        const personProfile = await this.personProfileModel.findOne({ userId });
        return new PersonProfileResponseDto(personProfile);
    }

    async findAll(params: PersonProfileFilterDto): Promise<PersonProfileResponseDto[]> {
        const { page, limit, ...filters } = params;
        const personProfiles = await this.personProfileModel.find(filters).skip((page - 1) * limit).limit(limit);
        return personProfiles.map(personProfile => new PersonProfileResponseDto(personProfile));
    }

    async count(params: Partial<PersonProfileFilterDto>): Promise<number> {
        return await this.personProfileModel.countDocuments(params);
    }

    async update(id: string, personProfileDto: Partial<UpdatePersonProfileDto>): Promise<PersonProfileResponseDto> {
        const updatedPersonProfile = await this.personProfileModel.findByIdAndUpdate(id, personProfileDto, { new: true });
        return new PersonProfileResponseDto (updatedPersonProfile);
    }

    async delete(id: string): Promise<void> {
        await this.personProfileModel.findByIdAndDelete(id);
    }
}