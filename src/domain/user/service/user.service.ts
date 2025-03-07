import { AllMethods } from './../../../../node_modules/@types/supertest/types.d';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { hash, compare } from 'bcrypt';
import Redis from 'ioredis';
import { EmailService } from 'src/global/email/email.sender';
import { deleteRequestDto } from '../presentation/dto/request/delete.request.dto';
import { loginRequestDto } from '../presentation/dto/request/login.request.dto';
import { registerRequestDto } from '../presentation/dto/request/register.request.dto';
import { loginResponseDto } from '../presentation/dto/response/login.response.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @Inject('REDIS_CLIENT') //의존성 주입 방법으로 받아오기ㅈ
        private readonly redisClient: Redis,
        private emailService: EmailService
    ) { }

    async createUser(data: registerRequestDto) {
        const { user_name, key, user_password } = data;
        const encryptPassword = await this.encryptPassword(user_password);
        const user_email = await this.redisClient.get(key);

        console.log(user_email)
        console.log(`키값: ${key}`);
        console.log(`Redis에서 가져온 이메일: ${user_email}`);

        this.redisClient.del(key)

        await this.userRepository.save({
            user_name,
            user_email,
            user_password: encryptPassword
        });

        return HttpStatus.OK;
    }

    async loginUser(data: loginRequestDto): Promise<loginResponseDto> {
        const { user_name, user_password } = data;
        const user = await this.userRepository.findOneBy({ user_name });
        
        if (!user) throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);

        const match = await compare(user_password, user.user_password);
        if (!match) throw new HttpException('INVALID_PASSWORD', HttpStatus.UNAUTHORIZED);

        const payload = { authority: user.user_authority, id: user.id };
        const secretKey = 'FUCK';

        const accessToken = jwt.sign(payload, secretKey, { expiresIn: '1h' });
        const refreshToken = jwt.sign(payload, secretKey, { expiresIn: '1y' });

        await this.redisClient.set(refreshToken, user.id, 'EX', 31536000);

        return {
            access_token: accessToken,
            refresh_token: refreshToken
        }
    }

    async getUser() {
        return await this.userRepository.find();
    }


    async DeleteUser(data: deleteRequestDto): Promise<void> {
        const { user_name } = data;

        try {
            // 사용자 찾기
            const user = await this.userRepository.findOne({ where: { user_name } });

            if (!user) {
                throw new Error('User not found');
            }

            // 사용자 삭제
            await this.userRepository.delete({ user_name });

            console.log(`User ${user_name} has been deleted successfully.`);
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }

    async encryptPassword(password: string) {
        const DEFAULT_SALT = 11;
        return hash(password, DEFAULT_SALT);
    }
}
