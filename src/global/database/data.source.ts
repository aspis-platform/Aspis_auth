import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from 'src/domain/user/entity/user.entity';

config({ path: 'env.local' });

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: 5432,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: 'aspis_user',
  entities: [User], 
  synchronize: false, 
  logging: true, 

});
