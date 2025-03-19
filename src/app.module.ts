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
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './global/\bsecurity/roles.guard';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      ...dataSource.options, 
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRETKEY,
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([User]),
    UserModule,  // User 관련 모듈
    AuthModule,  // Auth 관련 모듈
    RedisModule,
    InviteModule,
    EmailModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}

