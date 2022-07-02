import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GumbyElection extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  year: number;

  @Column('int')
  month: number;

  @Column('text', { nullable: true })
  winner?: string;
}
