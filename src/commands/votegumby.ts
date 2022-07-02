import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, Interaction } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('votegumby')
  .setDescription("Votes for next month's Gumby");

export const execute = async (interaction: CommandInteraction) => {
  console.log('executed!');
  await interaction.reply('Pong!');
};
