import { GumbyVote } from './../entities/GumbyVote';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember, User } from 'discord.js';
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
    await interaction.reply(
      'There is currently not an election going on! If you believe this is an error, contact the developer, or cry about it!'
    );
    return;
  }

  const member = interaction.options.getMentionable('member');

  if (member instanceof User && member.bot) {
    await interaction.reply(
      "You think you're a funny guy, huh? You think you've beaten the system? Well let me tell you what, pal, I'm tired of it, and things are gonna change around here. Now, go outside and start eating grass, and take a picture of your mouth full of grass. If you do not do so in the next 30 minutes, I'm banning you. Have fun bud."
    );
    return;
  }
  if (member instanceof GuildMember) {
    const existingVote = await GumbyVote.findOne({
      where: {
        voter: interaction.member!.user.id,
        election: { id: election.id },
      },
    });
    if (existingVote) {
      if (existingVote.candidate === member.user.id) {
        await interaction.reply(
          'Your vote is already cast for that candidate.'
        );
        return;
      }

      existingVote.candidate = member.user.id;
      await existingVote.save();

      await interaction.reply('Your vote has been re-cast!');
      return;
    }

    const vote = new GumbyVote();
    vote.candidate = member.user.id;
    vote.election = Promise.resolve(election);
    vote.voter = interaction.member!.user.id;
    await vote.save();
    await interaction.reply(`Your vote has been cast!`);
  }
};
