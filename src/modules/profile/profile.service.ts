import { Injectable } from "@nestjs/common";
import { ProfileTypesEnum } from "./enums/profile-types.enum";
import { I18nService } from "nestjs-i18n";

import { IPersonProfileHttpResponse } from "../person-profile/interfaces/person-profile-http-response.interface";
import { PersonProfileService } from "../person-profile/person-profile.service";
import { UpdatePersonProfileDto } from "../person-profile/dto";

import { ICompanyProfileHttpResponse } from "../company-profile/interfaces/company-profile-http-response.interface";
import { CompanyProfileService } from "../company-profile/company-profile.service";
import { UpdateCompanyProfileDto } from "../company-profile/dto";

import { ProfileSearchPaginatedResponseDto, ProfileSearchResponseDto } from "./dto";

@Injectable()
export class ProfileService {
    constructor(
        private readonly i18n: I18nService,

        private readonly personProfileService: PersonProfileService,
        private readonly companyProfileService: CompanyProfileService,
    ) { }

    async createProfiles(userId: string, userName: string, lang: string): Promise<void> {
        try {
            await this.personProfileService.createPersonProfile(userId, userName, lang)
            await this.companyProfileService.createCompanyProfile(userId, userName, lang)
        } catch (error) {
            console.error(error);
        }
    }

    async findProfileByUserId(userId: string, type: ProfileTypesEnum, lang: string): Promise<ICompanyProfileHttpResponse | IPersonProfileHttpResponse> {
        if (type === ProfileTypesEnum.PERSON) {
            return this.personProfileService.findPersonProfileByUserId(userId, lang)
        } else if (type === ProfileTypesEnum.COMPANY) {
            return this.companyProfileService.findCompanyProfileByUserId(userId, lang)
        }

        throw new Error(this.i18n.t('translation.profile.invalid-profile-type', { lang }))
    }

    async updateProfileByUserId(
        userId: string, 
        type: ProfileTypesEnum, 
        profileDto: UpdatePersonProfileDto | UpdateCompanyProfileDto, 
        lang: string
    ): Promise<ICompanyProfileHttpResponse | IPersonProfileHttpResponse> {
        try {
            if (type === ProfileTypesEnum.PERSON) {
                return this.personProfileService.updatePersonProfileByUserId(userId, profileDto as UpdatePersonProfileDto, lang)
            } else if (type === ProfileTypesEnum.COMPANY) {
                return this.companyProfileService.updateCompanyProfileByUserId(userId, profileDto as UpdateCompanyProfileDto, lang)
            }
        } catch (error) {
            throw new Error(this.i18n.t('translation.profile.invalid-profile-type', { lang }))
        }
    }

    async getProfileUserNamesByUserIds(userIds: string[], lang: string): Promise<{userId: string, userName: string}[]> {
        if (!userIds || userIds.length === 0) {
            return [];
        }
        const personUserNames = await this.personProfileService.getPersonProfileUserNamesByUserIds(userIds, lang)
        const companyUserNames = await this.companyProfileService.getCompanyProfileUserNamesByUserIds(userIds, lang)
        return [...personUserNames, ...companyUserNames].map((profile) => ({userId: profile.userId, userName: `@${profile.userName}`}))
    }

    async searchProfilesByUsername(username: string, page: number, limit: number, lang: string): Promise<ProfileSearchPaginatedResponseDto> {
        const [personResult, companyResult] = await Promise.all([
            this.personProfileService.findByUsernameLike(username, page, limit, lang),
            this.companyProfileService.findByUsernameLike(username, page, limit, lang)
        ]);

        const allProfiles = [...personResult.profiles, ...companyResult.profiles];
        
        const uniqueProfilesMap = new Map<string, { _id: string, userId: string, userName: string }>();
        for (const profile of allProfiles) {
            if (!uniqueProfilesMap.has(profile.userId)) {
                uniqueProfilesMap.set(profile.userId, { _id: profile._id, userId: profile.userId, userName: profile.userName });
            }
        }

        const uniqueProfiles = Array.from(uniqueProfilesMap.values());
        const total = uniqueProfiles.length;

        uniqueProfiles.sort((a, b) => a.userName.localeCompare(b.userName));

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedProfiles = uniqueProfiles.slice(startIndex, endIndex);

        const profileDtos = paginatedProfiles.map(profile => 
            new ProfileSearchResponseDto(profile._id, profile.userId, profile.userName)
        );

        return new ProfileSearchPaginatedResponseDto(
            200,
            this.i18n.t('translation.profile.profiles-found', { lang }),
            profileDtos,
            total,
            page,
            limit
        );
    }

    async getProfileById(id: string, lang: string): Promise<ProfileSearchResponseDto> {
        const personProfile = await this.personProfileService.findProfileById(id, lang)
        const companyProfile = await this.companyProfileService.findProfileById(id, lang)
        if (personProfile) {
            return new ProfileSearchResponseDto(personProfile._id, personProfile.userId, personProfile.userName)
        }

        if (companyProfile) {
            return new ProfileSearchResponseDto(companyProfile._id, companyProfile.userId, companyProfile.userName)
        }

        throw new Error(this.i18n.t('translation.profile.profile-not-found', { lang }))
    }
}