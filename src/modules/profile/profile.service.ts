import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { PersonProfileRepository } from "./person/person-profile.repository.interface";
import { CompanyProfileRepository } from "./company/company-profile.repository.interface";
import { ProfileTypesEnum } from "./enums/profile-types.enum";
import { I18nService } from "nestjs-i18n";
import { ICompanyProfileHttpResponse, IPersonProfileHttpResponse } from "./interfaces";

@Injectable()
export class ProfileService {
    constructor(
        private readonly i18n: I18nService,

        @Inject('PersonProfileRepository')
        private readonly personProfileRepository: PersonProfileRepository,
        
        @Inject('CompanyProfileRepository')
        private readonly companyProfileRepository: CompanyProfileRepository,
    ) { }

    async findProfileByUserId(userId: string, type: ProfileTypesEnum, lang: string): Promise<ICompanyProfileHttpResponse | IPersonProfileHttpResponse> {
        if (type === ProfileTypesEnum.PERSON) {
            return this.findPersonProfileByUserId(userId, lang)
        } else if (type === ProfileTypesEnum.COMPANY) {
            return this.findCompanyProfileByUserId(userId, lang)
        }

        throw new BadRequestException(this.i18n.t('translation.profile.invalid-profile-type', { lang }))
    }

    async findPersonProfileByUserId(userId: string, lang: string): Promise<IPersonProfileHttpResponse> {
        try {
            const personProfile = await this.personProfileRepository.findByUserId(userId)
            return new IPersonProfileHttpResponse(200, this.i18n.t('translation.profile.person-profile-found', { lang }), personProfile)
        } catch (error) {
            throw new NotFoundException(this.i18n.t('translation.profile.person-profile-not-found', { lang }))
        }
    }

    async findCompanyProfileByUserId(userId: string, lang: string): Promise<ICompanyProfileHttpResponse> {
        try {
            const companyProfile = await this.companyProfileRepository.findByUserId(userId)
            return new ICompanyProfileHttpResponse(200, this.i18n.t('translation.profile.company-profile-found', { lang }), companyProfile)
        } catch (error) {
            throw new NotFoundException(this.i18n.t('translation.profile.company-profile-not-found', { lang }))
        }
    }

    async updateProfileByUserId(userId: string, type: ProfileTypesEnum, lang: string): Promise<ICompanyProfileHttpResponse | IPersonProfileHttpResponse> {
        if (type === ProfileTypesEnum.PERSON) {
            return this.updatePersonProfileByUserId(userId, lang)
        } else if (type === ProfileTypesEnum.COMPANY) {
            return this.updateCompanyProfileByUserId(userId, lang)
        }

        throw new BadRequestException(this.i18n.t('translation.profile.invalid-profile-type', { lang }))
    }

    async updatePersonProfileByUserId(userId: string, lang: string): Promise<IPersonProfileHttpResponse> {
        const personProfile = await this.personProfileRepository.findByUserId(userId)
        if (!personProfile) throw new NotFoundException(this.i18n.t('translation.profile.person-profile-not-found', { lang }))

        try {
            const updatedPersonProfile = await this.personProfileRepository.update(userId, personProfile)
            return new IPersonProfileHttpResponse(200, this.i18n.t('translation.profile.person-profile-updated', { lang }), updatedPersonProfile)
        } catch (error) {
            throw new BadRequestException(this.i18n.t('translation.profile.person-profile-update-error', { lang }))
        }
    }

    async updateCompanyProfileByUserId(userId: string, lang: string): Promise<ICompanyProfileHttpResponse> {
        const companyProfile = await this.companyProfileRepository.findByUserId(userId)
        if (!companyProfile) throw new NotFoundException(this.i18n.t('translation.profile.company-profile-not-found', { lang }))

        try {
            const updatedCompanyProfile = await this.companyProfileRepository.update(userId, companyProfile)
            return new ICompanyProfileHttpResponse(200, this.i18n.t('translation.profile.company-profile-updated', { lang }), updatedCompanyProfile)
        } catch (error) {
            throw new BadRequestException(this.i18n.t('translation.profile.company-profile-update-error', { lang }))
        }
    }
}