import { GumbyVote } from './../entities/GumbyVote';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember, Interaction } from 'discord.js';
import { GumbyElection } from '../entities/GumbyElection';
import { getCurrentTime } from '../time';

export const data = new SlashCommandBuilder()
  .setName('votegumby')
  .setDescription("Votes for next month's Gumby")
  .addMentionableOption(option =>
    option.setName('member').setDescription('The Gumby candidate')
  );

export const execute = async (interaction: CommandInteraction) => {
  if (!interaction.guild) {
    interaction.reply(
      'You are not voting within a guild! Please vote within any channel of the guild.'
    );
    return;
  }
  const date = getCurrentTime();
  const election = await GumbyElection.findOneBy({
    guildId: interaction.guild.id,
    year: date.year,
    month: date.month,
  });

  if (!election || election.winner) {
    interaction.reply(
      'There is currently not an election going on! If you believe this is an error, contact the developer, or cry about it!'
    );
    return;
  }

  const member = interaction.options.getMentionable('member');

  if (member instanceof GuildMember) {
    const existingVote = await GumbyVote.findOne({
      where: {
        voter: interaction.member!.user.id,
        election: { id: election.id },
      },
    });
    if (existingVote) {
      if (existingVote.candidate === member.user.id) {
        interaction.reply('Your vote is already cast for that candidate.');
        return;
      }

      existingVote.candidate = member.user.id;
      await existingVote.save();

      interaction.reply('Your vote has been re-cast!');
      return;
    }

    const vote = new GumbyVote();
    vote.candidate = member.user.id;
    vote.election = Promise.resolve(election);
    vote.voter = interaction.member!.user.id;
    await vote.save();

    interaction.reply(`Your vote has been cast!`);
  }
};
