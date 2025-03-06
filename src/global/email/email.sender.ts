import nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

// 이메일 옵션 타입 정의
interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export class EmailService {
  private configService: ConfigService;

  constructor(configService: ConfigService) {
    this.configService = configService;
  }

  // 이메일 보내는 함수
  async sendEmail({ to, subject, text, html }: EmailOptions): Promise<void> {
    try {
      // 이메일 전송 설정
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: this.configService.get<string>('EMAIL_USER'),
          pass: this.configService.get<string>('EMAIL_PASS'),
        },
      });

      // 이메일 내용
      const mailOptions = {
        from: this.configService.get<string>('EMAIL_USER'), // 발신 이메일 주소
        to, // 수신 이메일 주소
        subject, // 이메일 제목
        text, // 이메일 본문
        html, // 이메일 본문 (HTML 형식)
      };

      // 이메일 전송
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
