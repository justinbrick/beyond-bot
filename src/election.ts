import { TextChannel } from 'discord.js';
import { DateTime } from 'luxon';

import { discordClient } from './discord';
import { GumbyElection } from './entities/GumbyElection';
import { GumbyGuild } from './entities/GumbyGuild';
import { GumbyRole } from './entities/GumbyRole';
import { GumbyVote } from './entities/GumbyVote';
import { PermanentChannel } from './entities/PermanentChannel';
import { getCurrentTime } from './time';

export const initElection = async () => {
  const electionTimer = async () => {
    const date = getCurrentTime();
    const oldDate = date.minus({ months: 1 });
    const nextMonth = date.startOf('month').plus({ months: 1 });

    const guilds = await GumbyGuild.createQueryBuilder('guild')
      .select('guild')
      .getMany();
    for (const guild of guilds) {
      const electionChannel = await PermanentChannel.findOneBy({
        guildId: guild.id,
        name: 'bot', // This will find the bot channel, for testing.
      });
      if (!electionChannel)
        throw new Error(
          'Was unable to find the election channel for a Guild! Something is seriously wrong!'
        );
      // Creating a new election if there are 7 days left in the month.
      // If there has been a compensatory election, this won't create a new one.
      let election = await GumbyElection.findOneBy({
        guildId: guild.id,
        year: date.year,
        month: date.month,
      });
      // If there's not an election for the current month and there's 7 days left, we create one so that there's some free time in between.
      if (!election && date.day >= date.daysInMonth - 7) {
        election = new GumbyElection();
        election.startDate = date.toISODate();
        election.guildId = guild.id;
        election.month = date.month;
        election.year = date.year;
        const channelObject = await discordClient.channels.fetch(
          electionChannel.id
        );
        if (channelObject instanceof TextChannel)
          await channelObject.send(
            `A new election has started for ${nextMonth.monthLong}! Cast your votes now!`
          );
        await election.save();
      }
      // Creating a new election to compensate for the old one if there wasn't one previously.
      // This will override the next election period as well, so that there aren't any conflicts.
      let oldElection = await GumbyElection.findOneBy({
        guildId: guild.id,
        year: oldDate.year,
        month: oldDate.month,
      });
      if (!oldElection) {
        oldElection = await GumbyElection.findOneBy({
          guildId: guild.id,
          year: date.year,
          month: date.month,
        });
        // If there's still not a guild election, that means we have to create a compensation one.
        if (!oldElection) {
          oldElection = new GumbyElection();
          oldElection.startDate = date.toISODate();
          oldElection.guildId = guild.id;
          oldElection.month = date.month;
          oldElection.year = date.year;
          await oldElection.save();
          const channelObject = await discordClient.channels.fetch(
            electionChannel.id
          );
          if (channelObject instanceof TextChannel) {
            channelObject.send(
              'A delayed election has been created, and will last for 7 days! Please vote for Gumby of the Month!'
            );
          }
        }
      }

      // If the old election has not decided a winner, and the difference between days is more than 7.
      if (
        !oldElection.winner &&
        date.diff(DateTime.fromISO(oldElection.startDate), 'days').days > 7
      ) {
        const votes = await GumbyVote.find({
          where: { election: { id: oldElection.id } },
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
        if (entries.length === 0) continue;
        const winner = entries[0][0];
        const guildObject = await discordClient.guilds.fetch(guild.id);
        const gumby = await GumbyRole.getRole(guildObject);
        const winnerObject = await guildObject.members.fetch(winner);
        await gumby.setCurrent(winnerObject);
        const channelObject = await guildObject.channels.fetch(
          electionChannel.id
        );
        if (channelObject instanceof TextChannel) {
          await channelObject.send(
            `Gumby of the Month has been elected! Congratulations, <@${winner}>`
          );
        }

        oldElection.winner = winner;
        await oldElection.save();
      }
    }
  };

  electionTimer();
  setInterval(electionTimer, 1000 * 60 * 60);
};
