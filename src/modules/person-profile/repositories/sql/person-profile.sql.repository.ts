import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { 
  PersonProfileEntity, 
  PersonJobEntity, 
  PersonEducationEntity, 
  PersonCourseEntity, 
  PersonBankDataEntity, 
  PersonRelatedFileEntity 
} from "./person-profile.entity";
import { CreatePersonProfileDto, UpdatePersonProfileDto, PersonProfileResponseDto } from "../../dto";
import { PersonProfileRepository } from "../../person-profile.repository.interface";
import { PersonJob, PersonEducation, PersonCourse, PersonBankData, PersonRelatedFile } from "../../models";
import { GenderEnum, MaritalStatusEnum, BankAccountTypeEnum } from "../../enums";

@Injectable()
export class PersonProfileSQLRepository implements PersonProfileRepository {
  constructor(
    @InjectRepository(PersonProfileEntity)
    private personProfileRepository: Repository<PersonProfileEntity>,
    @InjectRepository(PersonJobEntity)
    private personJobRepository: Repository<PersonJobEntity>,
    @InjectRepository(PersonEducationEntity)
    private personEducationRepository: Repository<PersonEducationEntity>,
    @InjectRepository(PersonCourseEntity)
    private personCourseRepository: Repository<PersonCourseEntity>,
    @InjectRepository(PersonBankDataEntity)
    private personBankDataRepository: Repository<PersonBankDataEntity>,
    @InjectRepository(PersonRelatedFileEntity)
    private personRelatedFileRepository: Repository<PersonRelatedFileEntity>
  ) {}

  async create(personProfileDto: CreatePersonProfileDto): Promise<PersonProfileResponseDto> {
    const { professions, personEducations, personCourses, bankDataOne, bankDataTwo, relatedFiles, ...mainProfileData } = personProfileDto;
    
    const personProfile = this.personProfileRepository.create({
      ...mainProfileData,
      gender: mainProfileData.gender as GenderEnum,
      maritalStatus: mainProfileData.maritalStatus as MaritalStatusEnum
    });
    const savedPersonProfile = await this.personProfileRepository.save(personProfile);

    await this.createRelatedEntities(savedPersonProfile.id, {
      professions,
      personEducations,
      personCourses,
      bankDataOne,
      bankDataTwo,
      relatedFiles
    });

    return this.findById(savedPersonProfile.id.toString());
  }

  async findById(id: string): Promise<PersonProfileResponseDto> {
    const personProfile = await this.findProfileWithRelations(parseInt(id));
    if (!personProfile) {
      throw new Error(`Person profile with id ${id} not found`);
    }
    return this.transformEntityToResponse(personProfile);
  }

  async findByUserId(userId: string): Promise<PersonProfileResponseDto> {
    const personProfile = await this.personProfileRepository.findOne({
      where: { userId },
      relations: this.getRelations()
    });

    if (!personProfile) {
      throw new Error(`Person profile with userId ${userId} not found`);
    }

    return this.transformEntityToResponse(personProfile);
  }

  async update(id: string, personProfileDto: Partial<UpdatePersonProfileDto>): Promise<PersonProfileResponseDto> {
    const { professions, personEducations, personCourses, bankDataOne, bankDataTwo, relatedFiles, ...mainProfileData } = personProfileDto;
    
    await this.personProfileRepository.update(parseInt(id), {
      ...mainProfileData,
      gender: mainProfileData.gender as GenderEnum,
      maritalStatus: mainProfileData.maritalStatus as MaritalStatusEnum
    });

    await this.updateRelatedEntities(parseInt(id), {
      professions,
      personEducations,
      personCourses,
      bankDataOne,
      bankDataTwo,
      relatedFiles
    });

    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    const profileId = parseInt(id);
    await Promise.all([
      this.personJobRepository.delete({ personProfileId: profileId }),
      this.personEducationRepository.delete({ personProfileId: profileId }),
      this.personCourseRepository.delete({ personProfileId: profileId }),
      this.personBankDataRepository.delete({ personProfileId: profileId }),
      this.personRelatedFileRepository.delete({ personProfileId: profileId }),
      this.personProfileRepository.delete(profileId)
    ]);
  }

  async deleteByUserId(userId: string): Promise<void> {
    const personProfile = await this.personProfileRepository.findOne({
      where: { userId }
    });

    if (personProfile) {
      await this.delete(personProfile.id.toString());
    }
  }

  async findByUserIds(userIds: string[]): Promise<PersonProfileResponseDto[]> {
    const personProfiles = await this.personProfileRepository.find({
      where: { userId: In(userIds) },
      relations: this.getRelations()
    });

    return personProfiles.map(profile => this.transformEntityToResponse(profile));
  }

  // Helper methods
  private getRelations(): string[] {
    return ['professions', 'personEducations', 'personCourses', 'bankData', 'relatedFiles'];
  }

  private async findProfileWithRelations(id: number): Promise<PersonProfileEntity | null> {
    return this.personProfileRepository.findOne({
      where: { id },
      relations: this.getRelations()
    });
  }

  private async createRelatedEntities(
    profileId: number, 
    data: {
      professions?: PersonJob[];
      personEducations?: PersonEducation[];
      personCourses?: PersonCourse[];
      bankDataOne?: PersonBankData;
      bankDataTwo?: PersonBankData;
      relatedFiles?: PersonRelatedFile[];
    }
  ): Promise<void> {
    const { professions, personEducations, personCourses, bankDataOne, bankDataTwo, relatedFiles } = data;

    await Promise.all([
      this.createJobs(profileId, professions),
      this.createEducations(profileId, personEducations),
      this.createCourses(profileId, personCourses),
      this.createBankData(profileId, bankDataOne, bankDataTwo),
      this.createFiles(profileId, relatedFiles)
    ]);
  }

  private async updateRelatedEntities(
    profileId: number,
    data: {
      professions?: PersonJob[];
      personEducations?: PersonEducation[];
      personCourses?: PersonCourse[];
      bankDataOne?: PersonBankData;
      bankDataTwo?: PersonBankData;
      relatedFiles?: PersonRelatedFile[];
    }
  ): Promise<void> {
    const { professions, personEducations, personCourses, bankDataOne, bankDataTwo, relatedFiles } = data;

    await Promise.all([
      this.updateJobs(profileId, professions),
      this.updateEducations(profileId, personEducations),
      this.updateCourses(profileId, personCourses),
      this.updateBankData(profileId, bankDataOne, bankDataTwo),
      this.updateFiles(profileId, relatedFiles)
    ]);
  }

  private async createJobs(profileId: number, jobs?: PersonJob[]): Promise<void> {
    if (!jobs?.length) return;
    
    const jobEntities = jobs.map(job => 
      this.personJobRepository.create({ ...job, personProfileId: profileId })
    );
    await this.personJobRepository.save(jobEntities);
  }

  private async createEducations(profileId: number, educations?: PersonEducation[]): Promise<void> {
    if (!educations?.length) return;
    
    const educationEntities = educations.map(education => 
      this.personEducationRepository.create({
        educationInstitution: education.personEducationInstitution,
        educationCourse: education.personEducationCourse,
        educationStartDateMonth: education.personEducationStartDate?.getMonth() + 1,
        educationStartDateYear: education.personEducationStartDate?.getFullYear(),
        educationFinishDateMonth: education.personEducationFinishDate?.getMonth() + 1,
        educationFinishDateYear: education.personEducationFinishDate?.getFullYear(),
        educationDescription: education.personEducationDescription,
        personProfileId: profileId
      })
    );
    await this.personEducationRepository.save(educationEntities);
  }

  private async createCourses(profileId: number, courses?: PersonCourse[]): Promise<void> {
    if (!courses?.length) return;
    
    const courseEntities = courses.map(course => 
      this.personCourseRepository.create({
        courseInstitution: course.personCourseInstitution,
        courseName: course.personCourseName,
        courseStartDateMonth: course.personCourseStartDate?.getMonth() + 1,
        courseStartDateYear: course.personCourseStartDate?.getFullYear(),
        courseFinishDateMonth: course.personCourseFinishDate?.getMonth() + 1,
        courseFinishDateYear: course.personCourseFinishDate?.getFullYear(),
        courseDescription: course.personCourseCertificateFile,
        personProfileId: profileId
      })
    );
    await this.personCourseRepository.save(courseEntities);
  }

  private async createBankData(profileId: number, bankDataOne?: PersonBankData, bankDataTwo?: PersonBankData): Promise<void> {
    const bankDataEntities = [];
    
    if (bankDataOne) {
      bankDataEntities.push(this.personBankDataRepository.create({ ...bankDataOne, personProfileId: profileId }));
    }
    if (bankDataTwo) {
      bankDataEntities.push(this.personBankDataRepository.create({ ...bankDataTwo, personProfileId: profileId }));
    }
    
    if (bankDataEntities.length > 0) {
      await this.personBankDataRepository.save(bankDataEntities);
    }
  }

  private async createFiles(profileId: number, files?: PersonRelatedFile[]): Promise<void> {
    if (!files?.length) return;
    
    const fileEntities = files.map(file => 
      this.personRelatedFileRepository.create({ ...file, personProfileId: profileId })
    );
    await this.personRelatedFileRepository.save(fileEntities);
  }

  private async updateJobs(profileId: number, jobs?: PersonJob[]): Promise<void> {
    if (jobs === undefined) return;
    
    await this.personJobRepository.delete({ personProfileId: profileId });
    await this.createJobs(profileId, jobs);
  }

  private async updateEducations(profileId: number, educations?: PersonEducation[]): Promise<void> {
    if (educations === undefined) return;
    
    await this.personEducationRepository.delete({ personProfileId: profileId });
    await this.createEducations(profileId, educations);
  }

  private async updateCourses(profileId: number, courses?: PersonCourse[]): Promise<void> {
    if (courses === undefined) return;
    
    await this.personCourseRepository.delete({ personProfileId: profileId });
    await this.createCourses(profileId, courses);
  }

  private async updateBankData(profileId: number, bankDataOne?: PersonBankData, bankDataTwo?: PersonBankData): Promise<void> {
    if (bankDataOne === undefined && bankDataTwo === undefined) return;
    
    await this.personBankDataRepository.delete({ personProfileId: profileId });
    await this.createBankData(profileId, bankDataOne, bankDataTwo);
  }

  private async updateFiles(profileId: number, files?: PersonRelatedFile[]): Promise<void> {
    if (files === undefined) return;
    
    await this.personRelatedFileRepository.delete({ personProfileId: profileId });
    await this.createFiles(profileId, files);
  }

  private transformEntityToResponse(personProfile: PersonProfileEntity): PersonProfileResponseDto {
    const responseData = {
        ...personProfile,
      _id: personProfile.id.toString(),
      professions: this.transformJobs(personProfile.professions),
      personEducations: this.transformEducations(personProfile.personEducations),
      personCourses: this.transformCourses(personProfile.personCourses),
      personLanguages: personProfile.personLanguages,
      bankDataOne: this.transformBankData(personProfile.bankData)?.[0],
      bankDataTwo: this.transformBankData(personProfile.bankData)?.[1],
      relatedFiles: this.transformFiles(personProfile.relatedFiles),
    };

    return new PersonProfileResponseDto(responseData);
  }

  private transformJobs(jobs?: PersonJobEntity[]): PersonJob[] {
    return jobs?.map(job => ({
      jobId: job.jobId,
      jobStartDateMonth: job.jobStartDateMonth,
      jobStartDateYear: job.jobStartDateYear,
      jobFinishDateMonth: job.jobFinishDateMonth,
      jobFinishDateYear: job.jobFinishDateYear,
      jobDescription: job.jobDescription
    })) || [];
  }

  private transformEducations(educations?: PersonEducationEntity[]): PersonEducation[] {
    return educations?.map(education => ({
      personEducationInstitution: education.educationInstitution,
      personEducationCourse: education.educationCourse,
      personEducationStartDate: this.createDate(education.educationStartDateYear, education.educationStartDateMonth),
      personEducationFinishDate: this.createDate(education.educationFinishDateYear, education.educationFinishDateMonth),
      personEducationDescription: education.educationDescription,
      personEducationCertificateFile: undefined
    })) || [];
  }

  private transformCourses(courses?: PersonCourseEntity[]): PersonCourse[] {
    return courses?.map(course => ({
      personCourseInstitution: course.courseInstitution,
      personCourseName: course.courseName,
      personCourseStartDate: this.createDate(course.courseStartDateYear, course.courseStartDateMonth),
      personCourseFinishDate: this.createDate(course.courseFinishDateYear, course.courseFinishDateMonth),
      personCourseCertificateFile: course.courseDescription
    })) || [];
  }

  private transformBankData(bankData?: PersonBankDataEntity[]): PersonBankData[] {
    return bankData?.map(bank => ({
      bankName: bank.bankName,
      bankBranch: bank.bankAgency,
      bankAccount: bank.bankAccount,
      bankAccountType: bank.bankAccountType as BankAccountTypeEnum,
      bankPix: bank.bankPix
    })) || [];
  }

  private transformFiles(files?: PersonRelatedFileEntity[]): PersonRelatedFile[] {
    return files?.map(file => ({
      filesDescription: file.fileDescription,
      relatedFilesFiles: file.fileName,
      relatedFilesDateDay: undefined,
      relatedFilesDateMonth: undefined,
      relatedFilesDateYear: undefined
    })) || [];
  }

  private createDate(year?: number, month?: number): Date | undefined {
    return year && month ? new Date(year, month - 1) : undefined;
  }
}
