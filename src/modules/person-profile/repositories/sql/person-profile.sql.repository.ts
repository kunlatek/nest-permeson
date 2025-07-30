import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { PersonProfileEntity } from "./person-profile.entity";
import { CreatePersonProfileDto, UpdatePersonProfileDto, PersonProfileResponseDto } from "../../dto";
import { PersonProfileRepository } from "../../person-profile.repository.interface";
import { PersonEducation, PersonCourse, PersonBankData, PersonRelatedFile } from "../../models";
import { EducationLevelEnum } from "../../enums";

@Injectable()
export class PersonProfileSQLRepository implements PersonProfileRepository {
  constructor(
    @InjectRepository(PersonProfileEntity)
    private personProfileRepository: Repository<PersonProfileEntity>
  ) {}

  async create(personProfileDto: CreatePersonProfileDto): Promise<PersonProfileResponseDto> {
    const savedPersonProfile = await this.personProfileRepository.save(personProfileDto);
    return this.findById(savedPersonProfile.id.toString());
  }

  async findById(id: string): Promise<PersonProfileResponseDto> {
    const personProfile = await this.personProfileRepository.findOne({ where: { id: parseInt(id) } });
    if (!personProfile) return null;
    return this.transformEntityToResponse(personProfile);
  }

  async findByUserId(userId: string): Promise<PersonProfileResponseDto> {
    const personProfile = await this.personProfileRepository.findOne({ where: { userId } });
    if (!personProfile) return null;
    return this.transformEntityToResponse(personProfile);
  }

  async update(id: string, personProfileDto: Partial<UpdatePersonProfileDto>): Promise<PersonProfileResponseDto> {
    await this.personProfileRepository.update(parseInt(id), personProfileDto as any);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.personProfileRepository.delete(parseInt(id));
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.personProfileRepository.delete({ userId });
  }

  async findByUserIds(userIds: string[]): Promise<PersonProfileResponseDto[]> {
    const personProfiles = await this.personProfileRepository.find({
      where: { userId: In(userIds) }
    });

    return personProfiles.map(personProfile => this.transformEntityToResponse(personProfile));
  }

  private transformEntityToResponse(personProfile: PersonProfileEntity): PersonProfileResponseDto {
    const bankData = personProfile.bankData || [];
    
    const responseData = {
      ...personProfile,
      _id: personProfile.id.toString(),
      professions: personProfile.professions || [],
      personEducations: this.transformEducations(personProfile.personEducations || []),
      personCourses: this.transformCourses(personProfile.personCourses || []),
      bankDataOne: bankData[0] || null,
      bankDataTwo: bankData[1] || null,
      relatedFiles: personProfile.relatedFiles || []
    };

    return new PersonProfileResponseDto({
      ...responseData,
      personEducation: responseData.personEducation as EducationLevelEnum
    });
  }

  private transformEducations(educations: any[]): PersonEducation[] {
    return educations.map(education => ({
      personEducationInstitution: education.personEducationInstitution,
      personEducationCourse: education.personEducationCourse,
      personEducationStartDate: education.personEducationStartDate,
      personEducationFinishDate: education.personEducationFinishDate,
      personEducationDescription: education.personEducationDescription,
      personEducationCertificateFile: education.personEducationCertificateFile
    }));
  }

  private transformCourses(courses: any[]): PersonCourse[] {
    return courses.map(course => ({
      personCourseInstitution: course.personCourseInstitution,
      personCourseName: course.personCourseName,
      personCourseStartDate: course.personCourseStartDate,
      personCourseFinishDate: course.personCourseFinishDate,
      personCourseCertificateFile: course.personCourseCertificateFile
    }));
  }
}
