import {
  Collection,
  Guild,
  NonThreadGuildBasedChannel,
  OAuth2Guild,
} from 'discord.js';
import { discordClient } from './discord';
import { GumbyGuild } from './entities/GumbyGuild';
import { PermanentChannel } from './entities/PermanentChannel';
import { getGumby } from './gumby';

// A list of all the permanent channels.
export const permanentChannels = ['general', 'rules', 'development', 'bot'];

export const initChannels = async () => {
  const guilds = (await discordClient.guilds.fetch()).map(oauth => oauth);
  for (const oauth of guilds) {
    let data = await GumbyGuild.findOneBy({ id: oauth.id });
    data = data || new GumbyGuild();
    const guildMap = new Map(
      (await data.permanents).map(channel => [channel.id, channel])
    );
    let channelMap: Collection<string, NonThreadGuildBasedChannel> | null =
      null;
    for (const name of permanentChannels) {
      if (!guildMap.has(name)) {
        const guild = await oauth.fetch();
        const gumby = await getGumby(guild);
        channelMap =
          channelMap ||
          (await guild.channels.fetch()).flatMap((channel, key, collection) =>
            collection.set(channel.name, channel)
          );
        let similarChannel = channelMap.get(name);
        similarChannel =
          similarChannel ||
          (await guild.channels.create(name, { type: 'GUILD_TEXT' }));
        similarChannel.permissionOverwrites.create(gumby, {
          MANAGE_CHANNELS: false,
        });
      }
    }
  }
};

discordClient.on('ready', initChannels);
