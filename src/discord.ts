import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { Client, CommandInteraction, Intents } from 'discord.js';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { cwd } from 'process';
import { initGuilds } from './guilds';

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

export const discordRest = new REST({ version: '9' }).setToken(DISCORD_TOKEN);
export const discordClient = new Client({ intents: [Intents.FLAGS.GUILDS] });

discordClient.once('ready', () => {
  console.log('Ready!');
  initGuilds();
});

type Command = {
  data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction) => Promise<void>;
};

const commands: Array<Command> = [];

discordClient.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  console.log('interaction!');

  if (
    !['496802506769170432', '214474420423622657'].includes(
      interaction.member!.user.id
    )
  ) {
    console.log('bad user', interaction.member!.user.id);
    return;
  }

  const command = commands.find(
    command => command.data.name == interaction.commandName
  );

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true,
    });
  }
});

export const initDiscord = async () => {
  await discordClient.login(DISCORD_TOKEN);
  console.log('Logged into Discord!');

  const commandFiles = await readdir(join(cwd(), 'build', 'commands')).then(
    files => files.filter(file => file.endsWith('.js'))
  );
  for (const file of commandFiles) {
    const command = require(join(cwd(), 'build', 'commands', file)) as Command;
    commands.push(command);
  }

  await discordRest
    .put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands.map(command => command.data.toJSON()) }
    )
    .catch(err => console.error(err));
};
