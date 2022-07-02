import { getCurrentTime } from './../time';
import { DateTime } from 'luxon';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  static getCurrent(): Promise<GumbyElection | null> {
    const now = getCurrentTime();

    return this.findOne({ where: { year: now.year, month: now.month } });
  }
}
