import { getCurrentTime } from './../time';
import { DateTime } from 'luxon';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { GumbyRole } from './GumbyRole';

@Entity()
export class GumbyElection extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  year: number;

  @Column('int')
  month: number;

  @Column('text', { nullable: true })
  winner?: string;

  @Column('text')
  guildId: string;

  static getCurrent(): Promise<GumbyElection | null> {
    const now = getCurrentTime();

    return this.findOne({ where: { year: now.year, month: now.month } });
  }
}
