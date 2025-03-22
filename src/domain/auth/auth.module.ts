import { AuthController } from './presentation/auth.controller';
import { Module } from '@nestjs/common';
import { UserService } from '../user/service/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '../../global/redis/redis.datasource';
import { InviteModule } from '../invite/invite.module';
import { EmailModule } from 'src/global/email/email.module';
import { AuthService } from './service/auth.service';
import { ConfigModule } from '@nestjs/config';
import { refreshToken } from './dto/entity/refresh.entity';
import { User } from '../user/entity/user.entity';

@Module({
  imports: [
    RedisModule, 
    ConfigModule.forRoot(), // ✅ 여기 콤마 추가
    TypeOrmModule.forFeature([refreshToken,User]), // ✅ TypeORM 엔티티 등록
  ],
  providers: [AuthService,AuthController],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule { }