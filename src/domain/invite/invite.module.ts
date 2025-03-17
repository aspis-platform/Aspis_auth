import { Module } from '@nestjs/common';
import { InviteService } from './service/email.service';
import { inviteController } from './presentation/email.controller';
import { RedisModule } from 'src/global/redis/redis.datasource';
import { EmailModule } from 'src/global/email/email.module';

@Module({
  imports: [RedisModule,
    EmailModule,
    InviteModule
  ],
  providers: [InviteService],
  controllers: [inviteController],
  exports: [InviteService],
})
export class InviteModule { }
