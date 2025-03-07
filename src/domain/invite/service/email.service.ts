import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { randomUUID } from 'crypto';
import { EmailService } from 'src/global/email/email.sender';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  private emailService: EmailService
) {}

  async setEmail(email: string, ttl: number = 3600): Promise<string> { //저장된 이메일을 식별할 수 있는 고유한 키를 반환하는 역할을 한다.
    const key = randomUUID();
    
    const emailOptions = {
      to: email,
      subject: '로그인 인증 키',
      text: `안녕하세요! 로그인 인증 키는 https://aspis.ncloud.sbs/join?key=${key}입니다. 이 키를 사용하여 로그인을 진행하세요.`,
      html: `<h1>안녕하세요!</h1><p> https://aspis.ncloud.sbs/join?key=${key}입니다. 이 키를 사용하여 로그인을 진행하세요.</p>`,
    };
    await this.emailService.sendEmail(emailOptions);

    await this.redisClient.set(key, email, 'EX', ttl);
    return key
  }


  
  async deleteEmail(key: string): Promise<void> { //키를 가지고 그 키에 맞는 이메일을 삭제한다
    await this.redisClient.del(key);
  }
}
