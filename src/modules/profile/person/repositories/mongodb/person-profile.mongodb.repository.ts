import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MongoDBPersonProfile, PersonProfileDocument } from "./person-profile.schema";
import { CreatePersonProfileDto, PersonProfileFilterDto, UpdatePersonProfileDto } from "../../dto";
import { PersonProfile } from "../../models";
import { PersonProfileRepository } from "../../interfaces";

@Injectable()
export class PersonProfileMongoDBRepository implements PersonProfileRepository {
  constructor(
    @InjectModel(MongoDBPersonProfile.name) 
    private personProfileModel: Model<PersonProfileDocument>) {}

    async create(personProfileDto: CreatePersonProfileDto): Promise<PersonProfile> {
        const createdPersonProfile = new this.personProfileModel(personProfileDto);
        const savedPersonProfile = await createdPersonProfile.save();
        return new PersonProfile(savedPersonProfile);
    }

    async findById(id: string): Promise<PersonProfile> {
        const personProfile = await this.personProfileModel.findById(id);
        return new PersonProfile(personProfile);
    }

    async findByUserId(userId: string): Promise<PersonProfile> {
        const personProfile = await this.personProfileModel.findOne({ userId });
        return new PersonProfile(personProfile);
    }

    async findAll(params: PersonProfileFilterDto): Promise<PersonProfile[]> {
        const { page, limit, ...filters } = params;
        const personProfiles = await this.personProfileModel.find(filters).skip((page - 1) * limit).limit(limit);
        return personProfiles.map(personProfile => new PersonProfile(personProfile));
    }

    async count(params: Partial<PersonProfileFilterDto>): Promise<number> {
        return await this.personProfileModel.countDocuments(params);
    }

    async update(id: string, personProfileDto: UpdatePersonProfileDto): Promise<PersonProfile> {
        const updatedPersonProfile = await this.personProfileModel.findByIdAndUpdate(id, personProfileDto, { new: true });
        return new PersonProfile(updatedPersonProfile);
    }

    async delete(id: string): Promise<void> {
        await this.personProfileModel.findByIdAndDelete(id);
    }
}