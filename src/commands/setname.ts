import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, Interaction } from 'discord.js';
import { GumbyRole } from '../entities/GumbyRole';

export const data = new SlashCommandBuilder()
  .setName('setname')
  .addStringOption(option =>
    option
      .setName('guild_name')
      .setDescription("The name of the guild you'd like to set.")
      .setRequired(true)
  )
  .setDescription('Set the name of the server');

export const execute = async (interaction: CommandInteraction) => {
  const user = interaction.user;
  const guild = interaction.guild;
  const guildName = interaction.options.getString('guild_name');
  if (!guild || !guildName) {
    await interaction.reply('What are you, retarded?');
    return;
  }
  const gumbyOfGuild = await GumbyRole.findOneBy({ guildId: guild!.id });
  if (!gumbyOfGuild) {
    await interaction.reply(
      'There is no Gumby role for this guild. Please wait for the Gumby of the Month to be announced.'
    );
    return;
  }
  console.log(`${gumbyOfGuild.current}, ${user.id}`);
  if (gumbyOfGuild.current != user.id) {
    await interaction.reply(
      'LIAR! FRAUD! HERE YE HERE YE! I SENTENCE THIS HEATHEN TO HANGING AT THE GALLOWS!'
    );
    return;
  }

  // Set the name of the guild with the guild name option
  await guild.setName(guildName, 'Gumby of the Month: Set Guild Name');
};
