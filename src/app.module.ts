import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { UserModule } from './domain/user/user.module';
import { AuthModule } from './domain/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'donggun',
      password: process.env.DATABASE_PASSWORD, // 환경 변수로 비밀번호 처리
      database: 'postgres',
      entities: [path.join(__dirname, '/entity/*.{ts,js}')], // 경로 수정
      synchronize: false,  // 프로덕션 환경에서는 false
      logging: true,  // SQL 쿼리 로그 활성화
    }),
  UserModule,
  AuthModule
    ],
})
export class AppModule {}
