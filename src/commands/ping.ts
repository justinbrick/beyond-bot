import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, Interaction } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Replies with Pong!');

export const execute = async (interaction: CommandInteraction) => {
  console.log(interaction.member?.user.id);
  console.log('executed!');
  await interaction.reply('Pong!');
};
