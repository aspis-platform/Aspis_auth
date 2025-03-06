import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { registerUserDto } from '../presentation/dto/register.user.dto';
import { loginUserDto } from '../presentation/dto/login.user.dto';
import * as jwt from 'jsonwebtoken';
import { hash, compare } from 'bcrypt';
import Redis from 'ioredis';
import { EmailService } from 'src/global/email/email.sender';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @Inject('REDIS_CLIENT') 
        private readonly redisClient: Redis ,
        private emailService: EmailService
    ) {}

    async createUser(data: registerUserDto) {
        const { user_name, key, user_password } = data;
        const encryptPassword = await this.encryptPassword(user_password);
        const user_email = await this.redisClient.get(key);
        console.log(user_email)
        const emailOptions = {
            to: user_email,
            subject: '로그인 인증 키',
            text: `안녕하세요! 로그인 인증 키는 ${key}입니다. 이 키를 사용하여 로그인을 진행하세요.`,
            html: `<h1>안녕하세요!</h1><p>로그인 인증 키는 <strong>${key}</strong>입니다. 이 키를 사용하여 로그인을 진행하세요.</p>`,
          };
          await this.emailService.sendEmail(emailOptions);
        if(!user_email) {
             return HttpStatus.NOT_FOUND;
        }
           
        this.redisClient.del(key)

        await this.userRepository.save({
            user_name,
            user_email,
            user_password: encryptPassword
        });

        return HttpStatus.OK;
    }

    async loginUser(data: loginUserDto) {
        const { user_name, user_password } = data;
        const user = await this.userRepository.findOneBy({ user_name });

        if (!user) throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);

        const match = await compare(user_password, user.user_password);
        if (!match) throw new HttpException('INVALID_PASSWORD', HttpStatus.UNAUTHORIZED);

        const payload = { authority:user.user_authority, id:user.id };
        const secretKey = 'FUCK'; 

        const accessToken = jwt.sign(payload, secretKey, { expiresIn: '1h' });

        return { accessToken };
    }

    async getUser() {
        return await this.userRepository.find();
    }

    async encryptPassword(password: string) {
        const DEFAULT_SALT = 11;
        return hash(password, DEFAULT_SALT);
    }
}
