import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn } from "typeorm";
import { GenderEnum, MaritalStatusEnum, EducationLevelEnum } from "../../enums";

// Related entities
@Entity('person_jobs')
export class PersonJobEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  jobId?: string;

  @Column({ nullable: true })
  jobStartDateMonth?: number;

  @Column({ nullable: true })
  jobStartDateYear?: number;

  @Column({ nullable: true })
  jobFinishDateMonth?: number;

  @Column({ nullable: true })
  jobFinishDateYear?: number;

  @Column({ nullable: true })
  jobDescription?: string;

  @Column()
  personProfileId: number;
}

@Entity('person_educations')
export class PersonEducationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  educationInstitution?: string;

  @Column({ nullable: true })
  educationCourse?: string;

  @Column({ nullable: true })
  educationStartDateMonth?: number;

  @Column({ nullable: true })
  educationStartDateYear?: number;

  @Column({ nullable: true })
  educationFinishDateMonth?: number;

  @Column({ nullable: true })
  educationFinishDateYear?: number;

  @Column({ nullable: true })
  educationDescription?: string;

  @Column()
  personProfileId: number;
}

@Entity('person_courses')
export class PersonCourseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  courseInstitution?: string;

  @Column({ nullable: true })
  courseName?: string;

  @Column({ nullable: true })
  courseStartDateMonth?: number;

  @Column({ nullable: true })
  courseStartDateYear?: number;

  @Column({ nullable: true })
  courseFinishDateMonth?: number;

  @Column({ nullable: true })
  courseFinishDateYear?: number;

  @Column({ nullable: true })
  courseDescription?: string;

  @Column()
  personProfileId: number;
}

@Entity('person_bank_data')
export class PersonBankDataEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  bankName?: string;

  @Column({ nullable: true })
  bankAgency?: string;

  @Column({ nullable: true })
  bankAccount?: string;

  @Column({ nullable: true })
  bankAccountType?: string;

  @Column({ nullable: true })
  bankPix?: string;

  @Column()
  personProfileId: number;
}

@Entity('person_related_files')
export class PersonRelatedFileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  fileName?: string;

  @Column({ nullable: true })
  fileUrl?: string;

  @Column({ nullable: true })
  fileType?: string;

  @Column({ nullable: true })
  fileDescription?: string;

  @Column()
  personProfileId: number;
}

@Entity('person_profiles')
export class PersonProfileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  userId: string;

  @Column({ nullable: false })
  userName: string;

  @Column({ nullable: true })
  personName?: string;

  @Column({ nullable: true })
  personNickname?: string;

  @Column({ 
    type: 'enum', 
    enum: GenderEnum, 
    nullable: true 
  })
  gender?: GenderEnum;

  @Column({ type: 'date', nullable: true })
  birthday?: Date;

  @Column({ 
    type: 'enum', 
    enum: MaritalStatusEnum, 
    nullable: true 
  })
  maritalStatus?: MaritalStatusEnum;

  @Column({ nullable: true })
  motherName?: string;

  @Column({ nullable: true })
  fatherName?: string;

  @Column({ type: 'simple-array', nullable: true })
  tagId?: string[];

  @Column({ nullable: true })
  personDescription?: string;

  // Documents
  @Column({ nullable: true })
  cpf?: string;

  @Column({ nullable: true })
  cpfFile?: string;

  @Column({ nullable: true })
  rg?: string;

  @Column({ nullable: true })
  rgIssuingAuthority?: string;

  @Column({ type: 'date', nullable: true })
  rgIssuanceDate?: Date;

  @Column({ nullable: true })
  rgState?: string;

  @Column({ nullable: true })
  rgFile?: string;

  @Column({ nullable: true })
  passport?: string;

  @Column({ type: 'date', nullable: true })
  passportIssuanceDate?: Date;

  @Column({ type: 'date', nullable: true })
  passportExpirationDate?: Date;

  @Column({ nullable: true })
  passportFile?: string;

  // Contacts
  @Column({ nullable: true })
  phoneNumberOne?: string;

  @Column({ nullable: true })
  phoneNumberTwo?: string;

  @Column({ nullable: true })
  emailOne?: string;

  @Column({ nullable: true })
  emailTwo?: string;

  @Column({ nullable: true })
  linkedin?: string;

  @Column({ nullable: true })
  instagram?: string;

  @Column({ nullable: true })
  facebook?: string;

  @Column({ nullable: true })
  x?: string;

  // Addresses
  @Column({ nullable: true })
  addressOneCepBrasilApi?: string;

  @Column({ nullable: true })
  addressOneType?: string;

  @Column({ nullable: true })
  addressOneStreet?: string;

  @Column({ nullable: true })
  addressOneNumber?: string;

  @Column({ nullable: true })
  addressOneComplement?: string;

  @Column({ nullable: true })
  addressOneCity?: string;

  @Column({ nullable: true })
  addressOneState?: string;

  @Column({ nullable: true })
  addressTwoCepBrasilApi?: string;

  @Column({ nullable: true })
  addressTwoType?: string;

  @Column({ nullable: true })
  addressTwoStreet?: string;

  @Column({ nullable: true })
  addressTwoNumber?: string;

  @Column({ nullable: true })
  addressTwoComplement?: string;

  @Column({ nullable: true })
  addressTwoCity?: string;

  @Column({ nullable: true })
  addressTwoState?: string;

  // Education
  @Column({ 
    type: 'enum', 
    enum: EducationLevelEnum, 
    nullable: true 
  })
  personEducation?: EducationLevelEnum;

  @Column({ type: 'simple-array', nullable: true })
  personLanguages?: string[];

  // Required fields
  @Column({ nullable: false })
  createdBy: string;

  @Column({ nullable: false })
  ownerId: string;

  // Timestamps
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => PersonJobEntity, job => job.personProfileId)
  @JoinColumn({ name: 'id', referencedColumnName: 'personProfileId' })
  professions?: PersonJobEntity[];

  @OneToMany(() => PersonEducationEntity, education => education.personProfileId)
  @JoinColumn({ name: 'id', referencedColumnName: 'personProfileId' })
  personEducations?: PersonEducationEntity[];

  @OneToMany(() => PersonCourseEntity, course => course.personProfileId)
  @JoinColumn({ name: 'id', referencedColumnName: 'personProfileId' })
  personCourses?: PersonCourseEntity[];

  @OneToMany(() => PersonBankDataEntity, bankData => bankData.personProfileId)
  @JoinColumn({ name: 'id', referencedColumnName: 'personProfileId' })
  bankData?: PersonBankDataEntity[];

  @OneToMany(() => PersonRelatedFileEntity, file => file.personProfileId)
  @JoinColumn({ name: 'id', referencedColumnName: 'personProfileId' })
  relatedFiles?: PersonRelatedFileEntity[];
}