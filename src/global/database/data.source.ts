import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from 'src/domain/user/entity/user.entity';
import { refreshToken } from 'src/domain/auth/dto/entity/refresh.entity';

config({ path: 'env.local' });

export const dataSource = new DataSource({
  type: 'mysql',  // MySQL을 사용할 경우
  host: process.env.DB_HOST,  // MySQL 호스트
  port: 3306,  // MySQL 기본 포트
  username: process.env.DB_USERNAME,  // MySQL 사용자 이름
  password: process.env.DB_PASSWORD,  // MySQL 비밀번호
  database: 'prod_aspis',  // 데이터베이스 이름
  entities: [User,refreshToken], 
  synchronize: true, 
  logging: true,
  driver: require('mysql2'),
});
