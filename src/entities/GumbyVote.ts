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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => GumbyElection)
  election: Promise<GumbyElection>;

  @Column('text')
  voter: string;

  @Column('text')
  candidate: string;
}
