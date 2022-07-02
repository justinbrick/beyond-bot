import 'reflect-metadata';

import { join } from 'path';
import { cwd } from 'process';
import { DataSource } from 'typeorm';

export const initDb = async () => {
  const AppDataSource = new DataSource({
    type: 'sqlite',
    database: join(cwd(), 'db.sqlite'),
    entities: [join(cwd(), 'build', 'entities', '**', '*.js')],
    synchronize: true,
    // dropSchema: true,
  });

  await AppDataSource.initialize()
    .then(() => {
      console.log('Data Source has been initialized!');
    })
    .catch(err => {
      console.error('Error during Data Source initialization', err);
    });
};
