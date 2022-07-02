import { discordClient } from './discord';
import { GumbyElection } from './entities/GumbyElection';
import { DateTime } from 'luxon';
import { TextChannel } from 'discord.js';
import { getCurrentTime } from './time';
import { GumbyVote } from './entities/GumbyVote';

export const initElection = async () => {
  const electionTimer = async () => {
    const date = getCurrentTime();
    const nextMonth = date.startOf('month').plus({ months: 1 });

    // if we're in the last week of the month
    if (date.day >= date.daysInMonth - 7) {
      const existingElection = await GumbyElection.findOne({
        where: { year: date.year, month: date.month },
      });

      if (!existingElection) {
        const channel = discordClient.channels.cache.get('992859469237207041');
        if (channel instanceof TextChannel) {
          channel.send(
            `The new Gumby election has started for the month of ${nextMonth.toFormat(
              'LLLL'
            )}, ${nextMonth.year}!`
          );
        }

        const election = new GumbyElection();
        election.month = date.month;
        election.year = date.year;
        await election.save();
      }
    } else {
      const previousMonth = date.startOf('month').minus({ months: 1 });
      const election = await GumbyElection.findOne({
        where: { month: previousMonth.month, year: previousMonth.year },
      });

      if (!election) return;

      if (!election.winner) {
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
          return;
        }

        const winner = entries[0][0];

        election.winner = winner;
        await election.save();

        const channel = discordClient.channels.cache.get('992859469237207041');
        if (channel instanceof TextChannel) {
          channel.send(
            `The new Gumby election has ended and the winner is <@${winner}>!`
          );

          // set their roles and shit here
        }
      }
    }
  };

  electionTimer();
  setInterval(electionTimer, 30 * 1000);
};
