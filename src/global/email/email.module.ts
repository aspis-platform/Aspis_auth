import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email.sender'; // EmailService 경로 맞춰서 수정

@Module({
  imports: [ConfigModule], // ConfigModule을 이메일 모듈에 임포트해서 환경 변수 로드
  providers: [EmailService], // EmailService를 providers 배열에 추가
  exports: [EmailModule, EmailService], // 다른 모듈에서 사용하려면 exports에 추가
})
export class EmailModule { }