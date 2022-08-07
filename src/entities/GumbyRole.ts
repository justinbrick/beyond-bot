import { Guild, GuildMember, Role } from 'discord.js';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { discordClient } from '../discord';
import { permissionsSet } from '../gumby';

@Entity()
export class GumbyRole extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  guildId: string;

  @Column('text', { nullable: true })
  current?: string;

  @Column('unsigned big int', { nullable: true })
  permissionFlags?: bigint;

  async setCurrent(member: GuildMember) {
    const guild = await discordClient.guilds.fetch(this.guildId);
    const gumby = await guild.roles.fetch(this.id);
    if (!gumby) {
      throw new Error(
        'There has been an error setting the current Gumby! Cannot find Gumby Role!'
      );
    }
    if (this.current) {
      const oldMember = await guild.members.fetch(this.current);
      await oldMember.roles.remove(gumby, 'Old Gumby!'); // Remove the current role from the old gumby of the month.
    }
    this.current = member.id;
    const newMember = await guild.members.fetch(member.id);
    await newMember.roles.add(gumby, 'New Gumby!');
    await this.save();
  }

  static async getRole(guild: Guild) {
    let data = await GumbyRole.findOneBy({ guildId: guild.id });
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
      await role.setPermissions(permissionsSet);
      data = new GumbyRole();
      data.guildId = guild.id;
      data.id = role.id;
      await data.save();
    }
    return data;
  }
}

// Deprecated
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
