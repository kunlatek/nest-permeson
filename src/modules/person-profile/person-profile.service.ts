import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { PersonProfileRepository } from "./person-profile.repository.interface";
import { I18nService } from "nestjs-i18n";
import { IPersonProfileHttpResponse } from "./interfaces";
import { UpdatePersonProfileDto } from "./dto";

@Injectable()
export class PersonProfileService {
    constructor(
        private readonly i18n: I18nService,

        @Inject('PersonProfileRepository')
        private readonly personProfileRepository: PersonProfileRepository,
    ) { }

    async createPersonProfile(userId: string, userName: string, lang: string): Promise<void> {
        try {
            await this.personProfileRepository.create({ userId, userName, createdBy: userId, ownerId: userId });
        } catch (error) {
            throw new Error(this.i18n.t('translation.person-profile.person-profile-create-error', { lang }))
        }
    }

    async findPersonProfileByUserId(userId: string, lang: string): Promise<IPersonProfileHttpResponse> {
        try {
            const personProfile = await this.personProfileRepository.findByUserId(userId)
            return new IPersonProfileHttpResponse(200, this.i18n.t('translation.person-profile.person-profile-found', { lang }), personProfile)
        } catch (error) {
            throw new NotFoundException(this.i18n.t('translation.person-profile.person-profile-not-found', { lang }))
        }
    }

    async updatePersonProfileByUserId(userId: string, personProfileDto: UpdatePersonProfileDto, lang: string): Promise<IPersonProfileHttpResponse> {
        try {
            const personProfile = await this.personProfileRepository.findByUserId(userId)
            if (!personProfile) throw new NotFoundException(this.i18n.t('translation.person-profile.person-profile-not-found', { lang }))

            const updatedPersonProfile = await this.personProfileRepository.update(personProfile._id.toString(), personProfileDto)
            return new IPersonProfileHttpResponse(200, this.i18n.t('translation.person-profile.person-profile-updated', { lang }), updatedPersonProfile)
        } catch (error) {
            throw new Error(this.i18n.t('translation.person-profile.person-profile-update-error', { lang }))
        }
    }

    async getPersonProfileUserNamesByUserIds(userIds: string[], lang: string): Promise<{userId: string, userName: string}[]> {
        const personUserNames = await this.personProfileRepository.findByUserIds(userIds)
        return personUserNames.map((profile) => ({userId: profile.userId, userName: profile.userName}))
    }

    async findByUsernameLike(username: string, page: number, limit: number, lang: string): Promise<{ profiles: {userId: string, userName: string}[], total: number }> {
        const result = await this.personProfileRepository.findByUsernameLike(username, page, limit);
        return {
            profiles: result.profiles.map((profile) => ({userId: profile.userId, userName: profile.userName})),
            total: result.total
        };
    }
}