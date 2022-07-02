import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PermanentChannel } from './PermanentChannel';

@Entity()
export class GumbyGuild extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => PermanentChannel, channel => channel.guild)
  permanents: Promise<PermanentChannel[]>;
}
