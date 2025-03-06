import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './domain/user/user.module';
import { AuthModule } from './domain/auth/auth.module';
import { dataSource } from './global/database/data.source'; // dataSource import
import { RedisModule } from './global/redis/redis.datasource';  // 경로 수정
import { InviteModule } from './domain/invite/invite.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './domain/user/entity/user.entity';
import { EmailModule } from './global/email/email.module';


@Module({
  imports: [
    ConfigModule.forRoot({
        isGlobal: true,  // 환경변수를 전역에서 사용할 수 있도록 설정
      }),

    TypeOrmModule.forRoot({
      ...dataSource.options,  // dataSource의 옵션을 펼쳐서 전달
    }),
    
    TypeOrmModule.forFeature([User]),  // User 엔티티를 이 모듈에서 사용하도록 등록
    UserModule,  // User 관련 모듈
    AuthModule,  // Auth 관련 모듈
    RedisModule,
    InviteModule,
    EmailModule
  ],
})
export class AppModule {}
