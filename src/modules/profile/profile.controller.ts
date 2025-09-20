import { Controller, Get, HttpCode, Put, Query, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { ProfileTypesEnum } from "./enums/profile-types.enum";
import { I18nLang } from "nestjs-i18n";
import { IHttpResponse } from "src/interfaces";
import { ProfileService } from "./profile.service";

import { IPersonProfileHttpResponse } from "../person-profile/interfaces";
import { PersonProfileResponseDto } from "../person-profile/dto/person-profile-response.dto";

import { ICompanyProfileHttpResponse } from "../company-profile/interfaces";
import { CompanyProfileResponseDto } from "../company-profile/dto/company-profile-response.dto";

import { ProfileSearchPaginatedResponseDto } from "./dto";

@ApiTags('Profile')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('profiles')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @Get()
    @ApiSecurity('jwt')
    @HttpCode(200)
    @ApiOperation({ summary: 'Search profiles' })
    @ApiResponse({ status: 200, description: 'Profiles found successfully', type: ProfileSearchPaginatedResponseDto })
    async searchProfiles(
        @Query('username') username: string = '',
        @Query('ids') ids: string[] = [],
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @I18nLang() lang?: string
    ): Promise<ProfileSearchPaginatedResponseDto> {
        return this.profileService.searchProfilesByUsername(username, page, limit, lang);
    }

    @Get('ids')
    @ApiSecurity('jwt')
    @HttpCode(200)
    @ApiOperation({ summary: 'Get profile user names by ids' })
    @ApiResponse({ status: 200, description: 'Profile user names found successfully' })
    async getProfileUserNamesByUserIds(
        @Query('ids') ids: string[] = [],
        @I18nLang() lang?: string
    ): Promise<{userId: string, userName: string}[]> {
        return this.profileService.getProfileUserNamesByUserIds(ids, lang);
    }

    @Get('person')
    @ApiSecurity('jwt')
    @HttpCode(200)
    @ApiOperation({ summary: 'Get profile by type' })
    @ApiResponse({ status: 200, description: 'Profile retrieved successfully', type: IPersonProfileHttpResponse })
    @ApiResponse({ status: 400, description: 'Invalid profile type' })
    async findPersonProfile(
        @Req() req: any,
        @I18nLang() lang?: string
    ): Promise<ICompanyProfileHttpResponse | IPersonProfileHttpResponse> {
        if (!req.user?.userId) throw new UnauthorizedException('Invalid token');
        return this.profileService.findProfileByUserId(req.user.userId, ProfileTypesEnum.PERSON, lang)
    }

    @Get('company')
    @ApiSecurity('jwt')
    @HttpCode(200)
    @ApiOperation({ summary: 'Get profile by type' })
    @ApiResponse({ status: 200, description: 'Profile retrieved successfully', type: ICompanyProfileHttpResponse })
    @ApiResponse({ status: 400, description: 'Invalid profile type' })
    async findCompanyProfile(
        @Req() req: any,
        @I18nLang() lang?: string
    ): Promise<ICompanyProfileHttpResponse | IPersonProfileHttpResponse> {
        if (!req.user?.userId) throw new UnauthorizedException('Invalid token');
        return this.profileService.findProfileByUserId(req.user.userId, ProfileTypesEnum.COMPANY, lang)
    }

    @Put('person')
    @ApiSecurity('jwt')
    @HttpCode(200)
    @ApiOperation({ summary: 'Update profile by type' })
    @ApiBody({ type: PersonProfileResponseDto })
    @ApiResponse({ status: 200, description: 'Profile updated successfully', type: IPersonProfileHttpResponse })
    @ApiResponse({ status: 400, description: 'Invalid profile type' })
    async update(
        @Req() req: any,
        @I18nLang() lang?: string
    ): Promise<IHttpResponse> {
        if (!req.user?.userId) throw new UnauthorizedException('Invalid token');
        return this.profileService.updateProfileByUserId(req.user.userId, ProfileTypesEnum.PERSON, req.body, lang)
    }

    @Put('company')
    @ApiSecurity('jwt')
    @HttpCode(200)
    @ApiOperation({ summary: 'Update profile by type' })
    @ApiBody({ type: CompanyProfileResponseDto })
    @ApiResponse({ status: 200, description: 'Profile updated successfully', type: ICompanyProfileHttpResponse })
    @ApiResponse({ status: 400, description: 'Invalid profile type' })
    async updateCompanyProfile(
        @Req() req: any,
        @I18nLang() lang?: string
    ): Promise<ICompanyProfileHttpResponse | IPersonProfileHttpResponse> {
        if (!req.user?.userId) throw new UnauthorizedException('Invalid token');
        return this.profileService.updateProfileByUserId(req.user.userId, ProfileTypesEnum.COMPANY, req.body, lang)
    }
}