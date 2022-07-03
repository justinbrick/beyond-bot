import { GumbyVote } from './../entities/GumbyVote';
import { GumbyElection } from './../entities/GumbyElection';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, Interaction } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('endvote')
  .setDescription('Ends the gumby vote');

export const execute = async (interaction: CommandInteraction) => {
  if (!interaction.guild) {
    interaction.reply('You must end this vote within a guild!');
    return;
  }
  const election = await GumbyElection.getCurrent(interaction.guild);
  if (!election) return;

  const votes = await GumbyVote.find({
    where: { election: { id: election.id } },
  });

  const candidates: Record<string, number> = {};

  for (const vote of votes) {
    if (!candidates[vote.candidate]) {
      candidates[vote.candidate] = 1;
    } else {
      candidates[vote.candidate]++;
    }
  }

  const entries = Object.entries(candidates).sort((a, b) => b[1] - a[1]);

  if (entries.length === 0) {
    await interaction.reply('bruh nobody voted');
    return;
  }

  const winner = entries[0][0];

  election.winner = winner;
  await election.save();

  await interaction.reply(`The winner is <@${winner}>!`);
};
