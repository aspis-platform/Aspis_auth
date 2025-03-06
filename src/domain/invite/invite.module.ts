import { Module } from '@nestjs/common';
import { RedisService } from './service/email.service';
import { RedisController } from './presentation/email.controller';
import { RedisModule } from 'src/global/redis/redis.datasource';

@Module({
  imports: [RedisModule],
  providers: [RedisService],
  controllers: [RedisController],
  exports: [RedisService],
})
export class InviteModule {}
