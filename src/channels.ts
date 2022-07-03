import { Collection, NonThreadGuildBasedChannel } from 'discord.js';
import { discordClient } from './discord';
import { GumbyGuild } from './entities/GumbyGuild';
import { PermanentChannel } from './entities/PermanentChannel';
import { getGumby } from './gumby';

// A list of all the permanent channels.
export const permanentChannels = ['general', 'rules', 'development', 'bot'];

export const initChannels = async () => {
  const guilds = (await discordClient.guilds.fetch()).map(oauth => oauth);
  for (const oauth of guilds) {
    const data = await PermanentChannel.findBy({ guildId: oauth.id });
    const names = data.map(channel => channel.name);
    const newChannels = permanentChannels.filter(name => !(name in names)); // If there's not a channel listed in this here, we've got to make them.
    if (newChannels.length == 0) return;
    const guild = await oauth.fetch();
    const channels = (await guild.channels.fetch()).flatMap((channel, _, c) =>
      c.set(channel.name, channel)
    );
    const gumby = await getGumby(guild);
    for (const channelName of newChannels) {
      let channel = channels.get(channelName);
      channel =
        channel ||
        (await guild.channels.create(channelName, {
          type: 'GUILD_TEXT',
        }));
      channel.permissionOverwrites.create(gumby, {
        MANAGE_CHANNELS: false,
      });
    }
  }
};
