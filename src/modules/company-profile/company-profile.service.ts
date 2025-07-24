import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { I18nService } from "nestjs-i18n";
import { ICompanyProfileHttpResponse } from "./interfaces";
import { CompanyProfileRepository } from "./company-profile.repository.interface";
import { UpdateCompanyProfileDto } from "./dto";

@Injectable()
export class CompanyProfileService {
    constructor(
        private readonly i18n: I18nService,

        @Inject('CompanyProfileRepository')
        private readonly companyProfileRepository: CompanyProfileRepository,
    ) { }

    async createCompanyProfile(userId: string, userName: string, lang: string): Promise<void> {
        try {   
            await this.companyProfileRepository.create({ userId, userName, createdBy: userId, ownerId: userId })
        } catch (error) {
            throw new BadRequestException(this.i18n.t('translation.company-profile.company-profile-create-error', { lang }))
        }
    }

    async findCompanyProfileByUserId(userId: string, lang: string): Promise<ICompanyProfileHttpResponse> {
        try {
            const companyProfile = await this.companyProfileRepository.findByUserId(userId)
            return new ICompanyProfileHttpResponse(200, this.i18n.t('translation.company-profile.company-profile-found', { lang }), companyProfile)
        } catch (error) {
            throw new NotFoundException(this.i18n.t('translation.company-profile.company-profile-not-found', { lang }))
        }
    }

    async updateCompanyProfileByUserId(userId: string, companyProfileDto: UpdateCompanyProfileDto, lang: string): Promise<ICompanyProfileHttpResponse> {
        const companyProfile = await this.companyProfileRepository.findByUserId(userId)
        if (!companyProfile) throw new NotFoundException(this.i18n.t('translation.company-profile.company-profile-not-found', { lang }))

        try {
            const updatedCompanyProfile = await this.companyProfileRepository.update(companyProfile._id.toString(), companyProfileDto)
            return new ICompanyProfileHttpResponse(200, this.i18n.t('translation.company-profile.company-profile-updated', { lang }), updatedCompanyProfile)
        } catch (error) {
            throw new BadRequestException(this.i18n.t('translation.company-profile.company-profile-update-error', { lang }))
        }
    }

    async getCompanyProfileUserNamesByUserIds(userIds: string[], lang: string): Promise<{userId: string, userName: string}[]> {
        const companyUserNames = await this.companyProfileRepository.findByUserIds(userIds)
        return companyUserNames.map((profile) => ({userId: profile.userId, userName: profile.userName}))
    }
}