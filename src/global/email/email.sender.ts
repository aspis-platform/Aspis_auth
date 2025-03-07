import * as nodemailer from 'nodemailer'; 
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

@Injectable() 
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  async sendEmail({ to, subject, text, html }: EmailOptions): Promise<void> {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: this.configService.get<string>('EMAIL_USER'),
          pass: this.configService.get<string>('EMAIL_PASS'),
        },
      });

      const mailOptions = {
        from: this.configService.get<string>('EMAIL_USER'),
        to,
        subject,
        text,
        html,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
