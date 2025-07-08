import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, PartialType, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, Req, Query, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InvitationService } from './invitation.service';
import { CreateInvitationDto } from './dto';
import { IInvitationHttpResponse, IInvitationHttpResponsePaginated } from './interfaces';

@ApiTags('Invitations')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('invitations')
export class InvitationController {
    constructor(private readonly invitationService: InvitationService) { }

    @Post()
    @ApiSecurity('jwt')
    @ApiOperation({ summary: 'Create a new invitation' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 201, description: 'Invitation created successfully', type: IInvitationHttpResponse })
    async create(@Body() createInvitationDto: CreateInvitationDto, @Req() req: any): Promise<IInvitationHttpResponse> {
        if (!req.user?.userId) throw new UnauthorizedException('Invalid token');

        try {
            createInvitationDto.createdBy = req.user.userId;
            createInvitationDto.ownerId = req.user.userId;
            const result = await this.invitationService.create(createInvitationDto);
            return new IInvitationHttpResponse(201, 'Invitation created successfully', result);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Get()
    @ApiSecurity('jwt')
    @ApiOperation({ summary: 'Get all invitations' })
    @ApiResponse({ status: 200, description: 'List of all invitations', type: IInvitationHttpResponsePaginated })
    async findAll(
        @Req() req: any,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('sortBy') sortBy?: string,
        @Query('sortDir') sortDir?: 'asc' | 'desc'
    ): Promise<IInvitationHttpResponsePaginated> {
        if (!req.user?.userId) throw new UnauthorizedException('Invalid token');

        try {
            const [data, total] = await Promise.all([
                this.invitationService.findAll(req.user.userId, page, limit, sortBy, sortDir),
                this.invitationService.count(req.user.userId)
            ]);
            return new IInvitationHttpResponsePaginated(data, total, page, limit);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Get(':id')
    @ApiSecurity('jwt')
    @ApiOperation({ summary: 'Get invitation by ID' })
    @ApiParam({ name: 'id', description: 'Invitation ID' })
    @ApiResponse({ status: 200, description: 'Invitation found', type: IInvitationHttpResponse })
    @ApiResponse({ status: 404, description: 'Invitation not found' })
    async findOne(@Param('id') id: string, @Req() req: any): Promise<IInvitationHttpResponse> {
        if (!req.user?.userId) throw new UnauthorizedException('Invalid token');

        try {
            const result = await this.invitationService.findOne(id, req.user.userId);
            return new IInvitationHttpResponse(200, 'Invitation found', result);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Patch(':id')
    @ApiSecurity('jwt')
    @ApiOperation({ summary: 'Update invitation' })
    @ApiParam({ name: 'id', description: 'Invitation ID' })
    @ApiBody({ type: PartialType(CreateInvitationDto) })
    @ApiResponse({ status: 200, description: 'Invitation updated successfully', type: IInvitationHttpResponse })
    @ApiResponse({ status: 404, description: 'Invitation not found' })
    async update(
        @Param('id') id: string,
        @Body() updateInvitationDto: Partial<CreateInvitationDto>,
        @Req() req: any
    ): Promise<IInvitationHttpResponse> {
        if (!req.user?.userId) throw new UnauthorizedException('Invalid token');

        try {
            const result = await this.invitationService.update(id, updateInvitationDto, req.user.userId);
            return new IInvitationHttpResponse(200, 'Invitation updated successfully', result);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Delete(':id')
    @ApiSecurity('jwt')
    @HttpCode(204)
    @ApiOperation({ summary: 'Delete invitation' })
    @ApiParam({ name: 'id', description: 'Invitation ID' })
    @ApiResponse({ status: 204, description: 'Invitation deleted successfully' })
    @ApiResponse({ status: 404, description: 'Invitation not found' })
    async remove(@Param('id') id: string, @Req() req: any): Promise<void> {
        if (!req.user?.userId) throw new UnauthorizedException('Invalid token');

        try {
            return this.invitationService.remove(id, req.user.userId);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Post(':id/resend')
    @ApiSecurity('jwt')
    @HttpCode(200)
    @ApiOperation({ summary: 'Resend invitation email' })
    @ApiParam({ name: 'id', description: 'Invitation ID' })
    @ApiResponse({ status: 200, description: 'Invitation email resent successfully' })
    @ApiResponse({ status: 404, description: 'Invitation not found' })
    resendEmail(@Param('id') id: string, @Req() req: any): Promise<void> {
        if (!req.user?.userId) throw new UnauthorizedException('Invalid token');

        try {
            return this.invitationService.resendEmail(id, req.user.userId);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}