import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('company_profiles')
export class CompanyProfileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  _id: string;

  @Column({ nullable: false })
  userId: string;

  @Column({ nullable: false })
  userName: string;

  @Column({ nullable: true })
  cnpj?: string;

  @Column({ nullable: true })
  companyName?: string;

  @Column({ nullable: true })
  businessName?: string;

  @Column({ type: 'date', nullable: true })
  birthday?: Date;

  @Column({ nullable: true })
  legalNature?: string;

  @Column({ nullable: true })
  companyDescription?: string;

  @Column({ nullable: true })
  logoImage?: string;

  @Column({ type: 'simple-array', nullable: true })
  companyImages?: string[];

  @Column({ type: 'simple-array', nullable: true })
  tagId?: string[];

  // Partners as JSON
  @Column({ type: 'simple-json', nullable: true })
  partners?: any[];

  // Contacts as JSON
  @Column({ type: 'simple-json', nullable: true })
  contacts?: any[];

  // Bank Data as JSON
  @Column({ type: 'simple-json', nullable: true })
  bankData?: any[];

  // Related Files as JSON
  @Column({ type: 'simple-json', nullable: true })
  relatedFiles?: any[];

  // Address One
  @Column({ nullable: true })
  addressOneCepBrasilApi?: string;

  @Column({ 
    type: 'varchar', 
    nullable: true 
  })
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

  // Address Two
  @Column({ nullable: true })
  addressTwoCepBrasilApi?: string;

  @Column({ 
    type: 'varchar', 
    nullable: true 
  })
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