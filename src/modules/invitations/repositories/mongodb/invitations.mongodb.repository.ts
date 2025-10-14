import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MongoDBInvitation, InvitationDocument } from "./invitation.schema";
import { CreateInvitationDto, UpdateInvitationDto, InvitationResponseDto } from "../../dto";
import { InvitationsRepository } from "../../invitations.repository.interface";

@Injectable()
export class InvitationsMongoDBRepository implements InvitationsRepository {
  constructor(
    @InjectModel(MongoDBInvitation.name)
    private invitationModel: Model<InvitationDocument>
  ) {}

  async create(invitationDto: CreateInvitationDto, workspaceId: string, createdBy: string): Promise<InvitationResponseDto> {
    const invitationData = {
      ...invitationDto,
      workspaceId: invitationDto.workspaceId || workspaceId,
      createdBy: invitationDto.createdBy || createdBy,
      accepted: false,
    };
    
    const createdInvitation = new this.invitationModel(invitationData);
    const savedInvitation = await createdInvitation.save();
    return this.transformDocumentToResponse(savedInvitation);
  }

  async findAll(workspaceId: string, page?: number, limit?: number, email?: string, accepted?: boolean): Promise<{ invitations: InvitationResponseDto[], total: number }> {
    const query: any = { workspaceId };
    
    if (email) {
      query.email = { $regex: email, $options: 'i' };
    }

    if (accepted !== undefined) {
      query.accepted = accepted;
    }
    
    const total = await this.invitationModel.countDocuments(query);
    
    let invitationsQuery = this.invitationModel.find(query).sort({ createdAt: -1 });
    
    if (page !== undefined && limit !== undefined) {
      const skip = (page - 1) * limit;
      invitationsQuery = invitationsQuery.skip(skip).limit(limit);
    }
    
    const invitations = await invitationsQuery.lean();
    
    return {
      invitations: invitations.map(invitation => this.transformDocumentToResponse(invitation)),
      total
    };
  }

  async findById(id: string, workspaceId: string): Promise<InvitationResponseDto> {
    const invitation = await this.invitationModel.findOne({ _id: id, workspaceId }).lean();
    if (!invitation) return null;
    return this.transformDocumentToResponse(invitation);
  }

  async findByEmail(email: string, workspaceId: string): Promise<InvitationResponseDto> {
    const invitation = await this.invitationModel.findOne({ email, workspaceId }).lean();
    if (!invitation) return null;
    return this.transformDocumentToResponse(invitation);
  }

  async update(id: string, invitationDto: UpdateInvitationDto, workspaceId: string): Promise<InvitationResponseDto> {
    const invitation = await this.invitationModel.findOne({ _id: id, workspaceId });
    
    if (!invitation) {
      throw new Error(`Invitation with id ${id} not found in workspace ${workspaceId}`);
    }

    const updatedInvitation = await this.invitationModel.findByIdAndUpdate(id, invitationDto, { new: true }).lean();
    return this.transformDocumentToResponse(updatedInvitation);
  }

  async delete(id: string, workspaceId: string): Promise<void> {
    const invitation = await this.invitationModel.findOne({ _id: id, workspaceId });
    
    if (!invitation) {
      throw new Error(`Invitation with id ${id} not found in workspace ${workspaceId}`);
    }

    await this.invitationModel.findByIdAndDelete(id);
  }

  private transformDocumentToResponse(invitation: any): InvitationResponseDto {
    const responseData = {
      ...invitation,
      _id: invitation._id.toString(),
      createdAt: invitation.createdAt instanceof Date 
        ? invitation.createdAt.toISOString() 
        : invitation.createdAt,
      updatedAt: invitation.updatedAt instanceof Date 
        ? invitation.updatedAt.toISOString() 
        : invitation.updatedAt,
    };

    return new InvitationResponseDto(responseData);
  }
}

