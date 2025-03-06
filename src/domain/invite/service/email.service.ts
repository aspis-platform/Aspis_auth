import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { randomUUID } from 'crypto';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  async setEmail(email: string, ttl: number = 3600): Promise<string> { //저장된 이메일을 식별할 수 있는 고유한 키를 반환하는 역할을 한다.
    const key = randomUUID();
    await this.redisClient.set(key, email, 'EX', ttl);
    return key
  }

  async getAndDeleteEmail(key: string){ // Redis에서 이메일을 조회하고, 해당 이메일을 삭제한 후, 성공 여부를 반환하는 역할을 한다.
    const value = await this.redisClient.get(key); 
    if (value) {
      await this.redisClient.del(key);
      return HttpStatus.OK
    }
    return null;
  }
  
  async deleteEmail(key: string): Promise<void> { //키를 가지고 그 키에 맞는 이메일을 삭제한다
    await this.redisClient.del(key);
  }
}
