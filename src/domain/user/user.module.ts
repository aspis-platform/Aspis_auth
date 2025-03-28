import { Module } from '@nestjs/common';
import { UserService } from '../user/service/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserController } from './presentation/user.controller';
import { RedisModule } from '../../global/redis/redis.datasource';
import { InviteModule } from '../invite/invite.module';
import { EmailModule } from 'src/global/email/email.module';
import { RefreshToken } from '../auth/entity/refresh.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User,RefreshToken]),
  RedisModule,
  EmailModule,
  InviteModule], //→ Redis, 이메일 관련 기능, 초대 관련 기능을 사용할 수 있도록 가져옴.

  providers: [UserService], //이 모듈에서 제공하는 서비스나 의존성 주입을 위한 프로바이더 목록
  controllers: [UserController],  //이 모듈이 제공하는 API 엔드포인트를 관리하는 컨트롤러 목록.
  exports: [UserService] //이 모듈이 다른 모듈에서 사용할 수 있도록 내보내는 목록.
})
export class UserModule { }