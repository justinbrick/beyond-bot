import { Guild, Permissions } from 'discord.js';
import { discordClient } from './discord';
import { GumbyRole } from './entities/GumbyRole';
import { getGumby } from './entities/GumbyRole';

export const permissionsSet =
  Permissions.FLAGS.MANAGE_MESSAGES |
  Permissions.FLAGS.MANAGE_CHANNELS |
  Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS |
  Permissions.FLAGS.MANAGE_ROLES |
  Permissions.FLAGS.MANAGE_MESSAGES |
  Permissions.FLAGS.MANAGE_NICKNAMES |
  Permissions.FLAGS.MODERATE_MEMBERS |
  Permissions.FLAGS.ATTACH_FILES |
  Permissions.FLAGS.KICK_MEMBERS |
  Permissions.FLAGS.VIEW_AUDIT_LOG |
  Permissions.FLAGS.CREATE_INSTANT_INVITE |
  Permissions.FLAGS.VIEW_GUILD_INSIGHTS |
  Permissions.FLAGS.MANAGE_GUILD;

export const gumbyRoleName = 'Gumby of the Month';

const createGumbyRole = async (guild: Guild) => {
  // We find if there's a similar role that already exists. If not, then we create one.
  const roles = await guild.roles.fetch();
  for (const role of roles.values()) {
    if (role.name == gumbyRoleName) return role;
  }
  const role = await guild.roles.create({
    name: gumbyRoleName,
    color: 'PURPLE',
    permissions: permissionsSet,
  });
  return role;
};

export const inityGumby = async () => {
  const guilds = await discordClient.guilds.fetch();
  for (const guild of guilds.values()) {
    let gumbyRole = await GumbyRole.findOneBy({ guildId: guild.id });
    if (!gumbyRole) {
      const actual = await guild.fetch();
      const role = await createGumbyRole(actual);
      gumbyRole = new GumbyRole();
      gumbyRole.id = role.id;
      gumbyRole.guildId = guild.id;
      gumbyRole.permissionFlags = role.permissions.bitfield;
      await gumbyRole.save();
    }
    if (gumbyRole.permissionFlags != permissionsSet) {
      const actual = await guild.fetch();
      const role = await actual.roles.fetch(gumbyRole.id);
      const botRole = (await actual.roles.fetch()).find(
        role => role.name == 'Beyond'
      );
      if (!botRole)
        throw new Error('Fatal error fetching Bot Role! Role not found!');
      if (!role)
        throw new Error(
          'Fatal error fetching gumby of the month! Role not found!'
        );
      await role.setPermissions(permissionsSet);
      await role.setPosition(botRole.position - 1);
      gumbyRole.permissionFlags = role.permissions.bitfield;
      await gumbyRole.save();
    }
  }
};
