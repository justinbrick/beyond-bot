import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, Interaction } from 'discord.js';
import { GumbyRole } from '../entities/GumbyRole';

export const data = new SlashCommandBuilder()
  .setName('setbanner')
  .addAttachmentOption(option =>
    option
      .setName('banner_image')
      .setDescription('The banner image to set')
      .setRequired(true)
  )
  .setDescription('Sets the banner of the server.');

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
  if (gumbyOfGuild.current != user.id || user.id == '214474420423622657') {
    await interaction.reply(
      'You are not the Gumby of the Month. Only the Gumby of the Month can set the banner.'
    );
    return;
  }

  await guild.setBanner(interaction.options.getAttachment('banner_image')!.url);
  await interaction.reply('Successfully set the server banner!');
};
