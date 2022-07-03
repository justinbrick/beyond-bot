import { config } from 'dotenv';
import { DateTime } from 'luxon';
import { join } from 'path';
import { cwd } from 'process';
config({ path: join(cwd(), '.env') });

import { initDb } from './db';
import { initDiscord } from './discord';
import { initElection } from './election';

const start = async () => {
  console.log('Connecting to database.');
  await initDb();
  await initDiscord();
  //await initElection();
};

start();
