import {
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  Body,
  UseGuards,
  Req,
  UnauthorizedException,
  Query,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiParam,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ActiveRoleGuard } from 'src/common/guards/active-role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/enums/user-role.enum';

import {
  CreatePersonProfileDto,
  UpdatePersonProfileDto,
  PersonProfileFilterDto,
} from './dto';
import { PersonProfileService } from './person-profile.service';
import { IPersonProfileHttpResponse, IPersonProfileHttpResponseCreate, IPersonProfileHttpResponsePaginated } from './interfaces';

@ApiTags('Person Profiles')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('person-profiles')
export class PersonProfileController {
  constructor(private readonly personProfileService: PersonProfileService) { }

  @Post()
  @ApiSecurity('jwt')
  @ApiOperation({ summary: 'Create a person profile' })
  @ApiResponse({
    status: 201,
    description: 'Person profile created successfully',
    type: IPersonProfileHttpResponseCreate,
  })
  async create(
    @Req() req,
    @Body() createPersonProfileDto: CreatePersonProfileDto,
  ): Promise<IPersonProfileHttpResponseCreate> {
    if (!req.user?.userId) {
      throw new UnauthorizedException('Invalid token');
    }

    try {
      createPersonProfileDto.userId = req.user.userId;
      const { profile, token } = await this.personProfileService.createProfile(createPersonProfileDto);
      return new IPersonProfileHttpResponseCreate(201, 'Person profile created successfully', { profile, token });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  @ApiSecurity('jwt')
  @ApiOperation({
    summary: 'Retrieve all person profiles with filtering and pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all person profiles',
    type: IPersonProfileHttpResponsePaginated,
  })
  @UseGuards(AuthGuard('jwt'), ActiveRoleGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(
    @Query() filterDto: PersonProfileFilterDto,
  ): Promise<IPersonProfileHttpResponsePaginated> {
    try {
      const { data, total } = await this.personProfileService.findAll(filterDto);
      return new IPersonProfileHttpResponsePaginated(data, total, filterDto.page, filterDto.limit);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  @ApiSecurity('jwt')
  @ApiOperation({ summary: 'Get a person profile by ID' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({
    status: 200,
    description: 'Person profile found',
    type: IPersonProfileHttpResponse,
  })
  async getById(@Param('id') id: string, @Req() req) {
    if (!req.user?.userId) {
      throw new UnauthorizedException('Invalid token');
    }

    try {
      const profile = await this.personProfileService.findProfileById(id);
      return new IPersonProfileHttpResponse(200, 'Person profile found', profile);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('user/:userId')
  @ApiSecurity('jwt')
  @ApiOperation({ summary: 'Get a person profile by userId' })
  @ApiParam({ name: 'userId', required: true })
  @ApiResponse({
    status: 200,
    description: 'Person profile found',
    type: IPersonProfileHttpResponse,
  })
  async findByUserId(@Param('userId') userId: string, @Req() req) {
    if (!req.user?.userId) {
      throw new UnauthorizedException('Invalid token');
    }

    try {
      const profile = await this.personProfileService.findProfileByUserId(userId);
      return new IPersonProfileHttpResponse(200, 'Person profile found', profile);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch(':id')
  @ApiSecurity('jwt')
  @ApiOperation({ summary: 'Update a person profile' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    type: IPersonProfileHttpResponse,
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdatePersonProfileDto,
    @Req() req,
  ): Promise<IPersonProfileHttpResponse> {
    if (!req.user?.userId) {
      throw new UnauthorizedException('Invalid token');
    }

    try {
      const profile = await this.personProfileService.updateProfile(
        id,
        updateDto,
        req.user.userId,
      );
      return new IPersonProfileHttpResponse(200, 'Profile updated successfully', profile);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @ApiSecurity('jwt')
  @ApiOperation({ summary: 'Delete a person profile' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Profile deleted successfully',
    type: IPersonProfileHttpResponse,
  })
  async delete(@Param('id') id: string, @Req() req): Promise<IPersonProfileHttpResponse> {
    if (!req.user?.userId) {
      throw new UnauthorizedException('Invalid token');
    }

    try {
      await this.personProfileService.deleteProfile(id, req.user.userId);
      return new IPersonProfileHttpResponse(200, 'Profile deleted successfully', null);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
