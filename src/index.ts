import { config } from 'dotenv';
import { join } from 'path';
import { cwd } from 'process';
config({ path: join(cwd(), '.env') });

import { initDb } from './db';
import { initDiscord } from './discord';

const start = async () => {
  console.log('Connecting to database.');
  await initDb();
  await initDiscord();
};

start();
