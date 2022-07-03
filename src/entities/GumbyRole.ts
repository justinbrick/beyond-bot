// After creation, I honestly asked myself, is this necessary? The answer is no, but it does have a use.
// If a role is in the database, it means that we already have it, and since it's cached can save a couple of requests.
// The ultimatum though is that this is completely useless, and if this ever ends up becoming more hassle than it's worth, it's going away.

import { Guild, GuildMember, Role } from 'discord.js';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { discordClient } from '../discord';

@Entity()
export class GumbyRole extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  guildId: string;

  async setCurrent(member: GuildMember) {
    const guild = await discordClient.guilds.fetch(this.guildId);
    const gumby = await guild.roles.fetch(this.id);
    if (!gumby)
      throw new Error(
        'There has been an error setting the current Gumby! Cannot find Gumby Role!'
      );
    for (const memberInfo of gumby.members) {
      memberInfo[1].roles.remove(gumby, 'Old Gumby!');
    }
  }
}

export const getGumby = async (guild: Guild) => {
  let data = await GumbyRole.findOneBy({ id: guild.id });
  if (!data) {
    let role: Role | undefined = (await guild.roles.fetch()).find(
      role => role.name == 'Gumby of the Month'
    );
    role =
      role ||
      (await guild.roles.create({
        name: 'Gumby of the Month',
        color: 'PURPLE',
      }));
    data = new GumbyRole();
    data.guildId = guild.id;
    data.id = role.id;
    await data.save();
  }

  const role = await guild.roles.fetch(data.id);
  if (!role)
    throw new Error(
      'Was unable to return the Gumby role, something went wrong!'
    );
  return role;
};
