import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MongoDBInvitation, InvitationDocument } from "./invitation.schema";
import { InvitationRepository } from "../../invitation.repository.interface";
import { CreateInvitationDto, InvitationFilterDto, InvitationResponseDto, UpdateInvitationDto } from "../../dto";

@Injectable()
export class InvitationMongoDBRepository implements InvitationRepository {
  constructor(
    @InjectModel(MongoDBInvitation.name)
    private invitationModel: Model<InvitationDocument>) { }

  async create(invitationDto: CreateInvitationDto): Promise<InvitationResponseDto> {
    const createdInvitation = new this.invitationModel(invitationDto);
    const savedInvitation = await createdInvitation.save();
    return new InvitationResponseDto(savedInvitation);
  }

  async findById(id: string): Promise<InvitationResponseDto> {
    const invitation = await this.invitationModel.findById(id);
    return new InvitationResponseDto(invitation);
  }

  async findByIdAndOwnerId(id: string, ownerId: string): Promise<InvitationResponseDto> {
    const invitation = await this.invitationModel.findOne({ _id: id, ownerId });
    return new InvitationResponseDto(invitation);
  }

  async findByEmail(email: string): Promise<InvitationResponseDto> {
    const invitation = await this.invitationModel.findOne({ email });
    return new InvitationResponseDto(invitation);
  }

  async findAll(params: InvitationFilterDto): Promise<InvitationResponseDto[]> {
    const { page, limit, ...filters } = params;
    const invitations = await this.invitationModel.find(filters).skip((page - 1) * limit).limit(limit);
    return invitations.map(invitation => new InvitationResponseDto(invitation));
  }

  async count(params: Partial<InvitationFilterDto>): Promise<number> {
    return await this.invitationModel.countDocuments(params);
  }

  async update(id: string, invitationDto: Partial<UpdateInvitationDto>): Promise<InvitationResponseDto> {
    const updatedInvitation = await this.invitationModel.findByIdAndUpdate(id, invitationDto, { new: true });
    return new InvitationResponseDto(updatedInvitation);
  }

  async delete(id: string): Promise<void> {
    await this.invitationModel.findByIdAndDelete(id);
  }
}