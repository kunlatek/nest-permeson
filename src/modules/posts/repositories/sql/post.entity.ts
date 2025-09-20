import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('posts')
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  _id: string;

  @Column({ nullable: false })
  titulo: string;

  @Column({ type: 'text', nullable: false })
  conteudo: string;

  @Column({ type: 'date', nullable: false })
  dataPublicacao: Date;

  @Column({ type: 'int', nullable: false })
  tempoLeitura: number;

  @Column({ nullable: false })
  autor: string;

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
