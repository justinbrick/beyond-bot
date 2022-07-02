import {
  BaseEntity,
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class GumbyRole extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  guildId: string;
}
