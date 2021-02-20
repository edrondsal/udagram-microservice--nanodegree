import { Sequelize} from 'sequelize-typescript'
import {config} from './config/config';


export const sequelize: Sequelize = new Sequelize({
  'dialect': 'postgres',
  'username': config.username,
  'password': config.password,
  'database': config.database,
  'host': config.host,
  'storage': ':memory:'
});
