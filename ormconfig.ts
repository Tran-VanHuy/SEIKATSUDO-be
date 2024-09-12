import { DataSource } from 'typeorm';
require('dotenv').config();

const dataSourceOptions = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || '',
  password: process.env.DB_PASSWORD || '',
  type: (process.env.DB_CONNECTION as 'mysql') || 'mysql',
  database: process.env.DB_DATABASE || '',
  synchronize: process.env.DB_SYNCHRONIZE == 'true',
  timezone: 'local',
  entities: ['dist/src/entities/*.entity{.ts,.js}'],
  migrations: ['dist/src/database/migrations/*.js'],
  seeds: ['dist/src/database/seeds/*.js'],
  extra: {
    connectionLimit: 50,
  },
};

export const AppDataSource = new DataSource(dataSourceOptions);
export default dataSourceOptions;
