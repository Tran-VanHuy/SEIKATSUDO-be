import { DataSource } from 'typeorm';
require('dotenv').config();

const dataSourceOptions : any = {
  type: 'mysql', // Đảm bảo là 'mysql'
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || '',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || '',
  synchronize: false, // Chỉ dùng cho môi trường phát triển
  timezone: 'local',
  entities: ['dist/src/entities/*.entity{.ts,.js}'],
  migrations: ['dist/src/database/migrations/*.js'],
  seeds: ['dist/src/database/seeds/*.js']
};

export const AppDataSource = new DataSource(dataSourceOptions);
export default dataSourceOptions;
