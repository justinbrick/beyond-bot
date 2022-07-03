import { discordClient } from './discord';
import { initChannels } from './channels';
import { GumbyGuild } from './entities/GumbyGuild';

export const initGuilds = async () => {
  const guilds = await discordClient.guilds.fetch();
  for (const guild of guilds) {
    if (await GumbyGuild.findBy({ id: guild[1].id })) continue; // If we know that this guild exists, we don't have to register it.
    const data = new GumbyGuild();
    data.id = guild[0];
    data.save();
  }

  await initChannels(); // After we've initialized guilds, let's go ahead and initialize the channels for them as well.
};
