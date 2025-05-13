import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { randomUUID } from 'crypto';
import { EmailService } from 'src/global/email/email.sender';

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

    // HTML 템플릿을 외부 파일 대신 코드에 직접 포함
    let emailHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>로그인 인증 키</title>
</head>
<body>
    <h1>안녕하세요!</h1>
    <p>
        안녕하세요 aspis입니다
        <a href="https://aspis.ncloud.sbs/join?key=${key}">https://aspis.ncloud.sbs/join?key=${key}</a>
        이 링크를 사용하여 로그인을 진행하세요.
    </p>
</body>
</html>`;


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
