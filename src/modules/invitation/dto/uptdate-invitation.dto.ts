import { PartialType } from '@nestjs/swagger';
import { CreateInvitationDto } from '.';

export class UpdateInvitationDto extends PartialType(CreateInvitationDto) {}