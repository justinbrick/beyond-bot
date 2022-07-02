import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GumbyGuild } from './GumbyGuild';

@Entity()
export class PermanentChannel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => GumbyGuild, guild => guild.permanents)
  guild: Promise<GumbyGuild>;
}
