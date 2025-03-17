import { AuthController } from './presentation/auth.controller';
import { Module } from '@nestjs/common';
import { UserService } from '../user/service/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '../../global/redis/redis.datasource';
import { InviteModule } from '../invite/invite.module';
import { EmailModule } from 'src/global/email/email.module';
import { AuthService } from './service/auth.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
  RedisModule, ConfigModule.forRoot() ],
  providers: [AuthService,AuthController],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule { }