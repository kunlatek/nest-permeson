import { Injectable } from "@nestjs/common";
import { ProfileTypesEnum } from "./enums/profile-types.enum";
import { I18nService } from "nestjs-i18n";

import { IPersonProfileHttpResponse } from "../person-profile/interfaces/person-profile-http-response.interface";
import { PersonProfileService } from "../person-profile/person-profile.service";
import { UpdatePersonProfileDto } from "../person-profile/dto";

import { ICompanyProfileHttpResponse } from "../company-profile/interfaces/company-profile-http-response.interface";
import { CompanyProfileService } from "../company-profile/company-profile.service";
import { UpdateCompanyProfileDto } from "../company-profile/dto";

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
        if (type === ProfileTypesEnum.PERSON) {
            return this.personProfileService.updatePersonProfileByUserId(userId, profileDto as UpdatePersonProfileDto, lang)
        } else if (type === ProfileTypesEnum.COMPANY) {
            return this.companyProfileService.updateCompanyProfileByUserId(userId, profileDto as UpdateCompanyProfileDto, lang)
        }

        throw new Error(this.i18n.t('translation.profile.invalid-profile-type', { lang }))
    }

    async getProfileUserNamesByUserIds(userIds: string[], lang: string): Promise<{userId: string, userName: string}[]> {
        const personUserNames = await this.personProfileService.getPersonProfileUserNamesByUserIds(userIds, lang)
        const companyUserNames = await this.companyProfileService.getCompanyProfileUserNamesByUserIds(userIds, lang)
        return [...personUserNames, ...companyUserNames].map((profile) => ({userId: profile.userId, userName: profile.userName}))
    }
}