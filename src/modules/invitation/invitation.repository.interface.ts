import { CreateInvitationDto, InvitationResponseDto, UpdateInvitationDto, InvitationFilterDto } from "./dto";

export interface InvitationRepository {
  create(invitationDto: CreateInvitationDto): Promise<InvitationResponseDto>;
  
  findById(id: string): Promise<InvitationResponseDto>;
  
  findByIdAndOwnerId(id: string, ownerId: string): Promise<InvitationResponseDto>;
  
  findByEmail(email: string): Promise<InvitationResponseDto>;
  
  findAll(params: InvitationFilterDto): Promise<InvitationResponseDto[]>;

  count(params: Partial<InvitationFilterDto>): Promise<number>;
  
  update(id: string, invitationDto: Partial<UpdateInvitationDto>): Promise<InvitationResponseDto>;
  
  delete(id: string): Promise<void>;
}