import { DataSource } from 'typeorm';

const PgDataSource = new DataSource({
  type: 'postgres',
  database: process.env.POSTGRES_DB,
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  entities: [
    __dirname + '/../**/*.entity.{js,ts}',
  ],
  synchronize: true,
  logging: 'all',
})

export default PgDataSource;