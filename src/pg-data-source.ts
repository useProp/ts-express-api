import { DataSource } from 'typeorm';
import config from './ormconfig';

const PgDataSource = new DataSource(config)

export default PgDataSource;