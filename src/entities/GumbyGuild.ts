import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class GumbyGuild extends BaseEntity {
  @PrimaryColumn()
  id: string;
}
