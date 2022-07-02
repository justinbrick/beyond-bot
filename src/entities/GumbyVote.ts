import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GumbyElection } from './GumbyElection';

@Entity()
export class GumbyVote extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => GumbyElection)
  election: Promise<GumbyElection>;

  @Column('text')
  candidate: string;
}
