import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like } from "typeorm";
import { InvitationEntity } from "./invitation.entity";
import { CreateInvitationDto, UpdateInvitationDto, InvitationResponseDto } from "../../dto";
import { InvitationsRepository } from "../../invitations.repository.interface";

@Injectable()
export class InvitationsSQLRepository implements InvitationsRepository {
  constructor(
    @InjectRepository(InvitationEntity)
    private invitationRepository: Repository<InvitationEntity>
  ) {}

  async create(invitationDto: CreateInvitationDto, workspaceId: string, createdBy: string): Promise<InvitationResponseDto> {
    const invitationData = {
      ...invitationDto,
      workspaceId: invitationDto.workspaceId || workspaceId,
      createdBy: invitationDto.createdBy || createdBy,
      accepted: false,
    };
    
    const savedInvitation = await this.invitationRepository.save(invitationData);
    return this.findById(savedInvitation.id.toString(), workspaceId);
  }

  async findAll(workspaceId: string, page?: number, limit?: number, email?: string, accepted?: boolean): Promise<{ invitations: InvitationResponseDto[], total: number }> {
    const whereCondition: any = { workspaceId };
    
    if (email) {
      whereCondition.email = Like(`%${email}%`);
    }

    if (accepted !== undefined) {
      whereCondition.accepted = accepted;
    }
    
    const total = await this.invitationRepository.count({ where: whereCondition });
    
    const findOptions: any = { 
      where: whereCondition,
      order: { createdAt: 'DESC' }
    };
    
    if (page !== undefined && limit !== undefined) {
      const skip = (page - 1) * limit;
      findOptions.skip = skip;
      findOptions.take = limit;
    }
    
    const invitations = await this.invitationRepository.find(findOptions);
    
    return {
      invitations: invitations.map(invitation => this.transformEntityToResponse(invitation)),
      total
    };
  }

  async findById(id: string, workspaceId: string): Promise<InvitationResponseDto> {
    const invitation = await this.invitationRepository.findOne({ 
      where: { id: parseInt(id), workspaceId }
    });
    if (!invitation) return null;
    return this.transformEntityToResponse(invitation);
  }

  async findByEmail(email: string, workspaceId: string): Promise<InvitationResponseDto> {
    const invitation = await this.invitationRepository.findOne({ 
      where: { email, workspaceId }
    });
    if (!invitation) return null;
    return this.transformEntityToResponse(invitation);
  }

  async update(id: string, invitationDto: UpdateInvitationDto, workspaceId: string): Promise<InvitationResponseDto> {
    const invitation = await this.invitationRepository.findOne({ 
      where: { id: parseInt(id), workspaceId }
    });
    
    if (!invitation) {
      throw new Error(`Invitation with id ${id} not found in workspace ${workspaceId}`);
    }

    await this.invitationRepository.update(parseInt(id), invitationDto as any);
    return this.findById(id, workspaceId);
  }

  async delete(id: string, workspaceId: string): Promise<void> {
    const invitation = await this.invitationRepository.findOne({ 
      where: { id: parseInt(id), workspaceId }
    });
    
    if (!invitation) {
      throw new Error(`Invitation with id ${id} not found in workspace ${workspaceId}`);
    }

    await this.invitationRepository.delete(parseInt(id));
  }

  private transformEntityToResponse(invitation: InvitationEntity): InvitationResponseDto {
    const responseData = {
      ...invitation,
      _id: invitation.id.toString(),
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

