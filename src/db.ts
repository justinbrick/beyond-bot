import 'reflect-metadata';

import { join } from 'path';
import { cwd } from 'process';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: join(cwd(), 'db.sqlite'),
  entities: [join(cwd(), 'build', 'entities', '**', '*.js')],
  migrations: [join(cwd(), 'build', 'migrations', '**', '*.js')],
  synchronize: true,
  //dropSchema: true,
});

export const initDb = async () => {
  await AppDataSource.initialize()
    .then(() => {
      console.log('Data Source has been initialized!');
    })
    .catch(err => {
      console.error('Error during Data Source initialization', err);
    });
};
