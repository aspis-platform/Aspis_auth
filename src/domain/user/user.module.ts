import { Module } from '@nestjs/common';
import { UserService } from '../user/service/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserController } from './presentation/user.controller';
import { RedisModule } from '../../global/redis/redis.datasource';
import { InviteModule } from '../invite/invite.module';
import { EmailModule } from 'src/global/email/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]),
  RedisModule,
  EmailModule,
InviteModule],

  providers: [UserService,InviteModule],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule { }