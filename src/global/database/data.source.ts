import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from 'src/domain/user/entity/user.entity';

config({ path: 'env.local' });

export const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: 'aspis_user',
  entities: [User], // 사용하려는 엔티티 배열
  synchronize: true, // true면 자동으로 테이블 생성, false면 마이그레이션 사용
  logging: true, // 로그 출력 여부
});
