import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CompanyProfileService } from './company-profile.service';
import { CreateCompanyProfileDto, UpdateCompanyProfileDto, CompanyProfileFilterDto } from './dto';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../enums/user-role.enum';
import { 
  ICompanyProfileHttpResponse, 
  ICompanyProfileHttpResponseCreate, 
  ICompanyProfileHttpResponsePaginated 
} from './interfaces/company-profile-http-response.interface';

@ApiTags('Company Profile')
@Controller('profile/company')
@UseGuards(RolesGuard)
export class CompanyProfileController {
  constructor(private readonly companyProfileService: CompanyProfileService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new company profile' })
  @ApiResponse({
    status: 201,
    description: 'Company profile created successfully',
    type: ICompanyProfileHttpResponseCreate,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Profile already exists' })
  async create(
    @Body() createCompanyProfileDto: CreateCompanyProfileDto,
  ): Promise<ICompanyProfileHttpResponseCreate> {
    const result = await this.companyProfileService.createProfile(createCompanyProfileDto);
    return new ICompanyProfileHttpResponseCreate(
      201,
      'Company profile created successfully',
      result,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all company profiles with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Company profiles retrieved successfully',
    type: ICompanyProfileHttpResponsePaginated,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async findAll(
    @Query() filterDto: CompanyProfileFilterDto,
  ): Promise<ICompanyProfileHttpResponsePaginated> {
    const { data, total } = await this.companyProfileService.findAll(filterDto);
    return new ICompanyProfileHttpResponsePaginated(
      data,
      total,
      filterDto.page || 1,
      filterDto.limit || 10,
    );
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user company profile' })
  @ApiResponse({
    status: 200,
    description: 'Company profile retrieved successfully',
    type: ICompanyProfileHttpResponse,
  })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async findMyProfile(@Request() req): Promise<ICompanyProfileHttpResponse> {
    const profile = await this.companyProfileService.findProfileByUserId(req.user.id);
    return new ICompanyProfileHttpResponse(200, 'Company profile retrieved successfully', profile);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get company profile by ID' })
  @ApiResponse({
    status: 200,
    description: 'Company profile retrieved successfully',
    type: ICompanyProfileHttpResponse,
  })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async findOne(@Param('id') id: string): Promise<ICompanyProfileHttpResponse> {
    const profile = await this.companyProfileService.findProfileById(id);
    return new ICompanyProfileHttpResponse(200, 'Company profile retrieved successfully', profile);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update company profile' })
  @ApiResponse({
    status: 200,
    description: 'Company profile updated successfully',
    type: ICompanyProfileHttpResponse,
  })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(
    @Param('id') id: string,
    @Body() updateCompanyProfileDto: UpdateCompanyProfileDto,
    @Request() req,
  ): Promise<ICompanyProfileHttpResponse> {
    const profile = await this.companyProfileService.updateProfile(
      id,
      updateCompanyProfileDto,
      req.user.id,
    );
    return new ICompanyProfileHttpResponse(200, 'Company profile updated successfully', profile);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete company profile' })
  @ApiResponse({ status: 204, description: 'Company profile deleted successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Request() req): Promise<void> {
    await this.companyProfileService.deleteProfile(id, req.user.id);
  }
}
