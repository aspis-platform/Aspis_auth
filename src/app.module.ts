import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './domain/auth/auth.module';
import { dataSource } from './global/database/data.source';
import { RedisModule } from './global/redis/redis.datasource';  
import { InviteModule } from './domain/invite/invite.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './domain/user/entity/user.entity';
import { EmailModule } from './global/email/email.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './global/security/roles.guard';
import { JwtModule } from '@nestjs/jwt';
import { RefreshToken } from './domain/auth/entity/refresh.entity';
import { UserModule } from './domain/user/user.module';


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
    TypeOrmModule.forFeature([User,RefreshToken]),
    UserModule,  // User 관련 모듈
    AuthModule,  // Auth 관련 모듈
    RedisModule,
    InviteModule,
    EmailModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}

