import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('workspaces')
export class WorkspaceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  _id: string;

  @Column({ nullable: false })
  owner: string;

  @Column({ type: 'simple-array', nullable: true })
  team?: string[];

  // ACL as JSON
  @Column({ type: 'simple-json', nullable: true })
  acl?: any[];

  // Timestamps
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 