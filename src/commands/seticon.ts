import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, Interaction } from 'discord.js';
import { GumbyRole } from '../entities/GumbyRole';

export const data = new SlashCommandBuilder()
  .setName('seticon')
  .addAttachmentOption(option =>
    option
      .setName('icon_image')
      .setDescription('The icon to be set')
      .setRequired(true)
  )
  .setDescription('Sets the icon of the server.');

export const execute = async (interaction: CommandInteraction) => {
  const user = interaction.user;
  const guild = interaction.guild;
  if (!guild) {
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
  if (gumbyOfGuild.current != user.id && user.id != '214474420423622657') {
    await interaction.reply(
      'Listen, toots, would ya stop it with the waterworks?'
    );
    return;
  }

  await guild.setIcon(interaction.options.getAttachment('icon_image')!.url);
  await interaction.reply('Successfully set the server icon!');
};
