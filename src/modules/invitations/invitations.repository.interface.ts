import { CreateInvitationDto, UpdateInvitationDto, InvitationResponseDto } from "./dto";

export interface InvitationsRepository {
  create(invitationDto: CreateInvitationDto, workspaceId: string, createdBy: string): Promise<InvitationResponseDto>;

  findAll(workspaceId: string, page?: number, limit?: number, email?: string, accepted?: boolean): Promise<{ invitations: InvitationResponseDto[], total: number }>;

  findById(id: string, workspaceId: string): Promise<InvitationResponseDto>;

  findByEmail(email: string, workspaceId: string): Promise<InvitationResponseDto>;

  update(id: string, invitationDto: UpdateInvitationDto, workspaceId: string): Promise<InvitationResponseDto>;

  delete(id: string, workspaceId: string): Promise<void>;
}

