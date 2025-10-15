import { BadRequestException, Inject, Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InvitationsRepository } from "./invitations.repository.interface";
import { CreateInvitationDto, UpdateInvitationDto, InvitationResponseDto, InvitationsFilterDto, CreateAdminInvitationDto } from "./dto";
import { I18nService } from "nestjs-i18n";
import { IInvitationHttpResponse, IInvitationsHttpResponse, IInvitationsPaginatedHttpResponse } from "./interfaces";
import { IHttpResponse } from "src/interfaces/http-response.interface";
import { WorkspaceService } from "../workspace/workspace.service";
import { EmailService } from "../auth/services/email.service";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";

@Injectable()
export class InvitationsService {
  constructor(
    @Inject('InvitationsRepository')
    private readonly invitationsRepository: InvitationsRepository,
    private readonly i18n: I18nService,
    private readonly workspaceService: WorkspaceService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  private async checkUserPermissions(userId: string, workspaceId: string, invitationId: string, lang: string): Promise<void> {
    try {
      const invitation = await this.invitationsRepository.findById(invitationId, workspaceId);
      if (!invitation) {
        throw new NotFoundException(this.i18n.t('translation.invitations.invitation-not-found', { lang }));
      }

      if (invitation.createdBy === userId) {
        return;
      }

      try {
        await this.workspaceService.findWorkspacesByOwner(userId, lang);
      } catch (error) {
        // Se não encontrou workspace por owner, continua para verificar outras permissões
      }

      throw new ForbiddenException(this.i18n.t('translation.invitations.insufficient-permissions', { lang }));
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new BadRequestException(this.i18n.t('translation.invitations.error-checking-permissions', { lang }));
    }
  }

  async create(invitationDto: CreateInvitationDto, workspaceId: string, createdBy: string, lang: string): Promise<IInvitationHttpResponse> {
    try {
      // Verifica se já existe convite para esse email no workspace
      const existingInvitation = await this.invitationsRepository.findByEmail(invitationDto.email, workspaceId);
      
      // Se existe convite e já foi aceito, verifica se o usuário tem conta
      if (existingInvitation && existingInvitation.accepted) {
        const existingUser = await this.userService.findByEmail(invitationDto.email);
        if (existingUser) {
          throw new BadRequestException(this.i18n.t('translation.invitations.user-already-registered', { lang }));
        }
      }

      // Se existe convite pendente (não aceito), reenvia o email
      if (existingInvitation && !existingInvitation.accepted) {
        try {
          const token = this.jwtService.sign({ 
            email: invitationDto.email, 
            workspaceId,
          }, { expiresIn: "7d" });
          
          await this.emailService.sendInvitationEmail(invitationDto.email, token);
          
          return new IInvitationHttpResponse(200, this.i18n.t('translation.invitations.invitation-resent', { lang }), existingInvitation);
        } catch (error) {
          console.error('Error resending invitation email:', error);
          throw new BadRequestException(this.i18n.t('translation.invitations.error-resending-invitation', { lang }));
        }
      }

      // Cria novo convite
      const invitation = await this.invitationsRepository.create(invitationDto, workspaceId, createdBy);
      
      // Envia email de convite
      try {
        const token = this.jwtService.sign({ 
          email: invitationDto.email, 
          workspaceId, 
        }, { expiresIn: "7d" });
        
        await this.emailService.sendInvitationEmail(invitationDto.email, token);
      } catch (error) {
        console.error('Error sending invitation email:', error);
        // Continua mesmo se o email falhar
      }

      return new IInvitationHttpResponse(201, this.i18n.t('translation.invitations.invitation-created', { lang }), invitation);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error(error);
      throw new BadRequestException(this.i18n.t('translation.invitations.error-creating-invitation', { lang }));
    }
  }

  async createAdmin(invitationDto: CreateAdminInvitationDto, lang: string): Promise<IInvitationHttpResponse> {
    try {
      // Verifica se o usuário já tem conta na plataforma
      const existingUser = await this.userService.findByEmail(invitationDto.email);
      if (existingUser) {
        throw new BadRequestException(this.i18n.t('translation.invitations.user-already-registered', { lang }));
      }

      const invitation = await this.invitationsRepository.create({
        email: invitationDto.email,
        workspaceId: null,
        createdBy: null,
      }, null, null);

      // Envia email de convite admin (sem workspace no token)
      try {
        const token = this.jwtService.sign({ 
          email: invitationDto.email,
          isAdmin: true // Flag para indicar que é convite admin
        }, { expiresIn: "7d" });
        
        await this.emailService.sendAdminInvitationEmail(invitationDto.email, token);
      } catch (error) {
        console.error('Error sending admin invitation email:', error);
        // Continua mesmo se o email falhar
      }

      return new IInvitationHttpResponse(201, this.i18n.t('translation.invitations.invitation-created', { lang }), invitation);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error(error);
      throw new BadRequestException(this.i18n.t('translation.invitations.error-creating-invitation', { lang }));
    }
  }

  async findAll(workspaceId: string, lang: string, page?: number, limit?: number, email?: string, accepted?: boolean): Promise<IInvitationsPaginatedHttpResponse | IInvitationsHttpResponse> {
    try {
      if (page !== undefined && limit !== undefined) {
        const result = await this.invitationsRepository.findAll(workspaceId, page, limit, email, accepted);
        return new IInvitationsPaginatedHttpResponse(200, this.i18n.t('translation.invitations.invitations-found', { lang }), result.invitations, result.total, page, limit);
      } else {
        const result = await this.invitationsRepository.findAll(workspaceId, undefined, undefined, email, accepted);
        return new IInvitationsHttpResponse(200, this.i18n.t('translation.invitations.invitations-found', { lang }), result.invitations);
      }
    } catch (error) {
      throw new BadRequestException(this.i18n.t('translation.invitations.error-finding-invitations', { lang }));
    }
  }

  async findById(id: string, workspaceId: string, lang: string): Promise<IInvitationHttpResponse> {
    try {
      const invitation = await this.invitationsRepository.findById(id, workspaceId);
      if (!invitation) {
        throw new NotFoundException(this.i18n.t('translation.invitations.invitation-not-found', { lang }));
      }
      return new IInvitationHttpResponse(200, this.i18n.t('translation.invitations.invitation-found', { lang }), invitation);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(this.i18n.t('translation.invitations.error-finding-invitation', { lang }));
    }
  }

  async update(id: string, invitationDto: UpdateInvitationDto, workspaceId: string, userId: string, lang: string): Promise<IInvitationHttpResponse> {
    try {
      await this.checkUserPermissions(userId, workspaceId, id, lang);
      
      const invitation = await this.invitationsRepository.update(id, invitationDto, workspaceId);
      return new IInvitationHttpResponse(200, this.i18n.t('translation.invitations.invitation-updated', { lang }), invitation);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      if (error.message.includes('not found')) {
        throw new NotFoundException(this.i18n.t('translation.invitations.invitation-not-found', { lang }));
      }
      throw new BadRequestException(this.i18n.t('translation.invitations.error-updating-invitation', { lang }));
    }
  }

  async delete(id: string, workspaceId: string, userId: string, lang: string): Promise<IHttpResponse> {
    try {
      await this.checkUserPermissions(userId, workspaceId, id, lang);
      
      await this.invitationsRepository.delete(id, workspaceId);
      return new IHttpResponse(204, this.i18n.t('translation.invitations.invitation-deleted', { lang }));
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      if (error.message.includes('not found')) {
        throw new NotFoundException(this.i18n.t('translation.invitations.invitation-not-found', { lang }));
      }
      throw new BadRequestException(this.i18n.t('translation.invitations.error-deleting-invitation', { lang }));
    }
  }

  async resendInvitation(id: string, workspaceId: string, userId: string, lang: string): Promise<IHttpResponse> {
    try {
      await this.checkUserPermissions(userId, workspaceId, id, lang);
      
      const invitation = await this.invitationsRepository.findById(id, workspaceId);
      if (!invitation) {
        throw new NotFoundException(this.i18n.t('translation.invitations.invitation-not-found', { lang }));
      }

      // Verifica se o convite já foi aceito
      if (invitation.accepted) {
        throw new BadRequestException(this.i18n.t('translation.invitations.invitation-already-accepted', { lang }));
      }

      // Gera novo token e reenvia email
      try {
        const token = this.jwtService.sign({ 
          email: invitation.email, 
          workspaceId: invitation.workspaceId, 
        }, { expiresIn: "7d" });
        
        await this.emailService.sendInvitationEmail(invitation.email, token);
      } catch (error) {
        console.error('Error resending invitation email:', error);
        throw new BadRequestException(this.i18n.t('translation.invitations.error-resending-invitation', { lang }));
      }

      return new IHttpResponse(200, this.i18n.t('translation.invitations.invitation-resent', { lang }));
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(this.i18n.t('translation.invitations.error-resending-invitation', { lang }));
    }
  }
}

