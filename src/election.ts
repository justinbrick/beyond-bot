import { discordClient } from './discord';
import { GumbyElection } from './entities/GumbyElection';
import { DateTime } from 'luxon';
import { TextChannel } from 'discord.js';

export const initElection = async () => {
  const electionTimer = async () => {
    const date = DateTime.fromISO('2022-06-30');
    const nextMonth = date.startOf('month').plus({ months: 1 });
    console.log(`${nextMonth.month}-${nextMonth.year}`);

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
            )}, ${nextMonth.year}`
          );
        }

        const election = new GumbyElection();
        election.month = date.month;
        election.year = date.year;
        await election.save();
      }
    }
  };

  electionTimer();
  setInterval(electionTimer, 30 * 1000);
};
