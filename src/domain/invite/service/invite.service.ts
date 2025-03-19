import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { randomUUID } from 'crypto';
import { EmailService } from 'src/global/email/email.sender';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class InviteService {
  find() {
    throw new Error('Method not implemented.');
  }
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  private emailService: EmailService
) {}

async setEmail(email: string, ttl: number = 3600): Promise<string> { //저장된 이메일을 식별할 수 있는 고유한 키를 반환하는 역할을 한다.
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
    return key
  }


  async getAllUsers(): Promise<any[]> {

const keys = await this.redisClient.keys('*'); 
    
if (keys.length === 0) return []; // 키가 없으면 빈 배열 반환


const values = await this.redisClient.mget(keys); 


const filteredValues = values.filter(value => value !== null);

return filteredValues; // null 값을 제외한 value 값만 반환
}

  
async deleteEmail(key: string): Promise<{ message: string }> {
  // Redis에서 키로 이메일을 가져옴
  const user_email = await this.redisClient.get(key);

  // 키에 해당하는 이메일이 존재하지 않으면
  if (!user_email) {
      throw new HttpException('KEY_NOT_FOUND', HttpStatus.NOT_FOUND); // '키값이 존재하지 않습니다'
  }

  // 이메일 삭제
  await this.redisClient.del(key);

  // 이메일 삭제 성공 메시지 반환
  return { message: 'Email deleted successfully' };
}

}
