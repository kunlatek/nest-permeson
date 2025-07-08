import { Controller, Get, Param, Put, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { ProfileTypesEnum } from "./enums/profile-types.enum";
import { IHttpResponse } from "src/interfaces";
import { ProfileService } from "./profile.service";
import { ICompanyProfileHttpResponse, IPersonProfileHttpResponse } from "./interfaces";

@ApiTags('Profile')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('profiles')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @Get('person')
    @ApiSecurity('jwt')
    @ApiOperation({ summary: 'Get profile by type' })
    @ApiResponse({ status: 200, description: 'Profile retrieved successfully', type: IPersonProfileHttpResponse })
    @ApiResponse({ status: 400, description: 'Invalid profile type' })
    async findPersonProfile(
        @Req() req: any,
    ): Promise<ICompanyProfileHttpResponse | IPersonProfileHttpResponse> {
        if (!req.user?.userId) throw new UnauthorizedException('Invalid token');
        return this.profileService.findProfileByUserId(req.user.userId, ProfileTypesEnum.PERSON, req.i18n.lang)
    }

    @Get('company')
    @ApiSecurity('jwt')
    @ApiOperation({ summary: 'Get profile by type' })
    @ApiResponse({ status: 200, description: 'Profile retrieved successfully', type: ICompanyProfileHttpResponse })
    @ApiResponse({ status: 400, description: 'Invalid profile type' })
    async findCompanyProfile(
        @Req() req: any,
    ): Promise<ICompanyProfileHttpResponse | IPersonProfileHttpResponse> {
        if (!req.user?.userId) throw new UnauthorizedException('Invalid token');
        return this.profileService.findProfileByUserId(req.user.userId, ProfileTypesEnum.COMPANY, req.i18n.lang)
    }

    @Put('person')
    @ApiSecurity('jwt')
    @ApiOperation({ summary: 'Update profile by type' })
    @ApiResponse({ status: 200, description: 'Profile updated successfully', type: IPersonProfileHttpResponse })
    @ApiResponse({ status: 400, description: 'Invalid profile type' })
    async update(
        @Req() req: any,
    ): Promise<IHttpResponse> {
        if (!req.user?.userId) throw new UnauthorizedException('Invalid token');
        return this.profileService.updateProfileByUserId(req.user.userId, ProfileTypesEnum.PERSON, req.i18n.lang)
    }

    @Put('company')
    @ApiSecurity('jwt')
    @ApiOperation({ summary: 'Update profile by type' })
    @ApiResponse({ status: 200, description: 'Profile updated successfully', type: ICompanyProfileHttpResponse })
    @ApiResponse({ status: 400, description: 'Invalid profile type' })
    async updateCompanyProfile(
        @Req() req: any,
    ): Promise<ICompanyProfileHttpResponse | IPersonProfileHttpResponse> {
        if (!req.user?.userId) throw new UnauthorizedException('Invalid token');
        return this.profileService.updateProfileByUserId(req.user.userId, ProfileTypesEnum.COMPANY, req.i18n.lang)
    }
}