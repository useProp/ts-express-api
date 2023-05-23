import 'dotenv/config';
import { DataSourceOptions } from 'typeorm';

const config: DataSourceOptions = {
  type: 'postgres',
  database: process.env.POSTGRES_DB,
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  entities: [
  __dirname + '/../**/*.entity.{js,ts}',
],
  migrations: [
    'src/migrations/*.ts',
],
  synchronize: true,
  dropSchema: true,
  logging: 'all',
};

export default config;