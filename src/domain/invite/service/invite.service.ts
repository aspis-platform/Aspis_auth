import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { randomUUID } from 'crypto';
import { EmailService } from 'src/global/email/email.sender';
import * as fs from 'fs';

@Injectable()
export class InviteService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    private emailService: EmailService,
  ) {}

  find() {
    throw new Error('Method not implemented.');
  }

  async setEmail(email: string, ttl: number = 3600): Promise<string> {
    const key = randomUUID();

    const filePath = __dirname + '/emailTemplate.html';
    let emailHtml = fs.readFileSync(filePath, 'utf-8');
    emailHtml = emailHtml.replace(/{{key}}/g, key);

    const emailOptions = {
      to: email,
      subject: '로그인 인증 키',
      text: `안녕하세요! 로그인 인증 키는 https://aspis.ncloud.sbs/join?key=${key}입니다. 이 키를 사용하여 로그인을 진행하세요.`,
      html: emailHtml,
    };

    await this.emailService.sendEmail(emailOptions);
    await this.redisClient.set(key, email, 'EX', ttl);

    return key;
  }

  async getAllUsers(): Promise<any[]> {
    const keys = await this.redisClient.keys('*');
    if (keys.length === 0) return [];

    const values = await this.redisClient.mget(keys);

    const keyValuePairs = keys
      .map((key, index) => ({
        id: key,
        email: values[index],
      }))
      .filter((item) => item.email !== null);

    return keyValuePairs;
  }

  async deleteEmail(key: string): Promise<{ message: string }> {
    const user_email = await this.redisClient.get(key);

    if (!user_email) {
      throw new HttpException('KEY_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    await this.redisClient.del(key);

    return { message: 'Email deleted successfully' };
  }
}
