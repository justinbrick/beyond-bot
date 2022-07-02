import { discordClient } from './discord';

export const initChannels = async () => {
  const guilds = (await discordClient.guilds.fetch()).map(oauth =>
    oauth.fetch()
  );
  for (const guild of guilds) {
    // TODO
  }
};

discordClient.on('ready', initChannels);
