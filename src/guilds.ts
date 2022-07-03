import { initChannels } from './channels';
import { discordClient } from './discord';
import { GumbyGuild } from './entities/GumbyGuild';

export const initGuilds = async () => {
  const guilds = await discordClient.guilds.fetch();
  for (const guild of guilds) {
    if (await GumbyGuild.findOneBy({ id: guild[1].id })) {
      console.log('This already exists!');
      continue;
    }
    const data = new GumbyGuild();
    data.id = guild[0];
    await data.save();
  }
};
