import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { InvitationResponseDto } from './dto/invitation-response.dto';
import { EmailService } from './services/email.service';
import { InvitationRepository } from './invitation.repository.interface';

@Injectable()
export class InvitationService {
  constructor(
    @Inject('InvitationRepository')
    private readonly invitationRepository: InvitationRepository,
    
    private readonly emailService: EmailService,
  ) { }

  async create(createInvitationDto: CreateInvitationDto): Promise<InvitationResponseDto> {
    const { createdBy, ownerId, ...invitationData } = createInvitationDto;

    const existingInvitation = await this.invitationRepository.findByEmail(invitationData.email);
    if (existingInvitation) {
      throw new BadRequestException('An invitation already exists for this email');
    }

    const invitation = await this.invitationRepository.create({
      ...invitationData,
      createdBy,
      ownerId: ownerId || createdBy,
    });

    try {
      await this.emailService.sendInvitationEmail(invitation.email, invitation._id.toString());
    } catch (error) {
      throw new BadRequestException('Failed to send invitation email');
    }

    return invitation;
  }

  async findAll(ownerId: string, page: number = 1, limit: number = 10, sortBy: string = 'createdAt', sortDir: 'asc' | 'desc' = 'asc'): Promise<InvitationResponseDto[]> {
    const sortOptions = { [sortBy]: sortDir === 'asc' ? 1 : -1 } as const;
    return await this.invitationRepository.findAll({
      page,
      limit,
      sort: sortOptions,
      filters: { $or: [{ ownerId }, { createdBy: ownerId }] }
    });
  }

  async count(ownerId: string): Promise<number> {
    return this.invitationRepository.count({ filters: { $or: [{ ownerId }, { createdBy: ownerId }] } });
  }

  async findOne(id: string, ownerId: string): Promise<InvitationResponseDto> {
    const invitation = await this.invitationRepository.findByIdAndOwnerId(id, ownerId);

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }
    return invitation;
  }

  async findByEmail(email: string): Promise<InvitationResponseDto | null> {
    return await this.invitationRepository.findByEmail(email);
  }

  async update(id: string, updateData: Partial<CreateInvitationDto>, ownerId: string): Promise<InvitationResponseDto> {
    const invitation = await this.findOne(id, ownerId);

    if (invitation.accepted) {
      throw new BadRequestException('Cannot update an accepted invitation');
    }

    if (updateData.email && updateData.email !== invitation.email) {
      throw new BadRequestException('Cannot change invitation email');
    }

    const { createdBy, ownerId: newOwnerId, ...updateFields } = updateData;
    return await this.invitationRepository.update(id, updateFields);
  }

  async remove(id: string, ownerId: string): Promise<void> {
    const invitation = await this.findOne(id, ownerId);

    if (invitation.accepted) {
      throw new BadRequestException('Cannot delete an accepted invitation');
    }

    await this.invitationRepository.delete(id);
  }

  async resendEmail(id: string, ownerId: string): Promise<void> {
    const invitation = await this.findOne(id, ownerId);

    if (invitation.accepted) {
      throw new BadRequestException('Cannot resend email for an accepted invitation');
    }

    try {
      await this.emailService.sendInvitationEmail(invitation.email, invitation._id);
    } catch (error) {
      throw new BadRequestException('Failed to send invitation email');
    }
  }

  async acceptInvitation(id: string): Promise<void> {
    const invitation = await this.invitationRepository.findById(id);
    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    if (invitation.accepted) {
      throw new BadRequestException('Invitation already accepted');
    }

    await this.invitationRepository.update(id, {
      accepted: true,
      acceptedAt: new Date()
    });
  }
} 