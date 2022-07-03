import { getCurrentTime } from './../time';
import { DateTime } from 'luxon';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Guild } from 'discord.js';

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

  @Column('text')
  startDate: string;

  // Gets the current election for a guild. Returns null is there is not an ongoing election.
  static getCurrent(guild: Guild): Promise<GumbyElection | null> {
    const now = getCurrentTime();

    return this.findOne({
      where: { guildId: guild.id, year: now.year, month: now.month },
    });
  }
}
