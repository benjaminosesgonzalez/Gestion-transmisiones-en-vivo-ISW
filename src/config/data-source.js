import { DataSource } from 'typeorm';
import * as entities from '../entities/index.js';
import { env } from './env.js';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  entities: Object.values(entities),
  migrations: ['src/migrations/*.js'],
  synchronize: false,
  logging: env.NODE_ENV === 'development',
});