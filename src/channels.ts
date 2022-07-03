import { Collection, Guild, NonThreadGuildBasedChannel } from 'discord.js';
import { discordClient } from './discord';
import { PermanentChannel } from './entities/PermanentChannel';
import { getGumby } from './entities/GumbyRole';

// A list of all the permanent channels.
export const permanentChannels = ['general', 'rules', 'development', 'bot'];

export const initChannels = async () => {
  console.log('god damnit');
  const g = await discordClient.guilds.fetch();
  const guilds = g.map(oauth => oauth);
  console.log('FUCKIN RUN');
  for (const oauth of guilds) {
    console.log("We're running here?");
    const data = await PermanentChannel.findBy({ guildId: oauth.id });
    const names = data.map(channel => channel.name);
    const newChannels = permanentChannels.filter(name => !(name in names)); // If there's not a channel listed in this here, we've got to make them.
    console.log(
      `This is the only thing that could possibly be stopping, right? ${newChannels.length}`
    );
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
      const permaChannel = new PermanentChannel();
      permaChannel.id = channel.id;
      permaChannel.guildId = guild.id;
      permaChannel.name = channelName;
      permaChannel.save();
    }
  }
  console.log('WHY ARE WE HERE???');
  return true;
};
