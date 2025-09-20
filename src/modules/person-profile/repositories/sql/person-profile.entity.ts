import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('person_profiles')
export class PersonProfileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  _id: string;

  @Column({ nullable: false })
  userId: string;

  @Column({ nullable: false })
  userName: string;

  @Column({ nullable: true })
  personName?: string;

  @Column({ nullable: true })
  personNickname?: string;

  @Column({ 
    type: 'varchar', 
    nullable: true 
  })
  gender?: string;

  @Column({ type: 'date', nullable: true })
  birthday?: Date;

  @Column({ 
    type: 'varchar', 
    nullable: true 
  })
  maritalStatus?: string;

  @Column({ nullable: true })
  motherName?: string;

  @Column({ nullable: true })
  fatherName?: string;

  @Column({ type: 'simple-array', nullable: true })
  tagId?: string[];

  @Column({ nullable: true })
  personDescription?: string;

  // Professions as JSON
  @Column({ type: 'simple-json', nullable: true })
  professions?: any[];

  // Person Educations as JSON
  @Column({ type: 'simple-json', nullable: true })
  personEducations?: any[];

  // Person Courses as JSON
  @Column({ type: 'simple-json', nullable: true })
  personCourses?: any[];

  // Bank Data as JSON
  @Column({ type: 'simple-json', nullable: true })
  bankData?: any[];

  // Related Files as JSON
  @Column({ type: 'simple-json', nullable: true })
  relatedFiles?: any[];

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
    type: 'varchar', 
    nullable: true 
  })
  personEducation?: string;

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
}