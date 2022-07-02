import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { GumbyGuild } from './GumbyGuild';

@Entity()
export class PermanentChannel extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => GumbyGuild, guild => guild.permanents)
  guild: Promise<GumbyGuild>;
}
