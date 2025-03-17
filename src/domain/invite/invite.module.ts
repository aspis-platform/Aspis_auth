import { Module } from '@nestjs/common';
import { RedisService } from './service/email.service';
import { inviteController } from './presentation/email.controller';
import { RedisModule } from 'src/global/redis/redis.datasource';
import { EmailModule } from 'src/global/email/email.module';

@Module({
  imports: [RedisModule,
    EmailModule,
    InviteModule
  ],
  providers: [RedisService],
  controllers: [inviteController],
  exports: [RedisService],
})
export class InviteModule { }
