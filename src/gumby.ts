import { Guild, Permissions, Role } from 'discord.js';
import { discordClient } from './discord';
import { GumbyRole } from './entities/GumbyRole';

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
  }

  const role = await guild.roles.fetch(data.id);
  if (!role)
    throw new Error(
      'Was unable to return the Gumby role, something went wrong!'
    );
  return role;
};
