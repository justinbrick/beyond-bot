import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { PermanentChannel } from './PermanentChannel';

@Entity()
export class GumbyGuild extends BaseEntity {
  @PrimaryColumn()
  id: string;
}
