import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('roles')
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  _id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ type: 'simple-json', nullable: false })
  permissions: { module: string; actionList: string[] }[];

  @Column({ nullable: false })
  workspace: string;

  @Column({ nullable: false })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

