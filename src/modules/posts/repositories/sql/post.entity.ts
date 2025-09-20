import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('posts')
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  _id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ type: 'date', nullable: false })
  publishedAt: Date;

  @Column({ type: 'int', nullable: false })
  readingTime: number;

  @Column({ nullable: false })
  author: string;

  @Column({ nullable: false })
  workspace: string;

  @Column({ nullable: false })
  createdBy: string;

  @Column({ nullable: false })
  ownerId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
