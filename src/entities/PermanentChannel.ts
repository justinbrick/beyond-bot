import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { GumbyGuild } from './GumbyGuild';

@Entity()
export class PermanentChannel extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  guildId: string;
}
