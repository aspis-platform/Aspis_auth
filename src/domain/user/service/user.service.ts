import { UserAuthority } from 'src/domain/user/entity/authority.enum';
import { RefreshToken } from './../../auth/dto/entity/refresh.entity';
import { HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
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
import { ConfigService } from '@nestjs/config';
import { CustomRequest } from 'src/global/types/custom-request.interface';
import { updateRequestDto } from '../presentation/dto/request/update.request.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
    constructor( 
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(RefreshToken)
        private refreshRepository: Repository<RefreshToken>,
        @Inject('REDIS_CLIENT') 
        private readonly redisClient: Redis,
        private emailService: EmailService,
        private readonly configService: ConfigService,
    ) { }

    async createUser(data: registerRequestDto) {
        const { user_name, key, user_password } = data;
    
        
        const user_email = await this.redisClient.get(key);
    
        
        if (!user_email) {
            throw new HttpException('KEY_NOT_FOUND', HttpStatus.NOT_FOUND); 
        }
    
        
        const encryptPassword = await this.encryptPassword(user_password);
    
        
        const user = await this.userRepository.findOneBy({ user_email });
        
        if (user) {
            throw new HttpException('ALREADY_USING_EMAIL', HttpStatus.CONFLICT); // 이메일 중복 처리
        }
    
        console.log(user_email);
        console.log(`키값: ${key}`);
        console.log(`Redis에서 가져온 이메일: ${user_email}`);
    
        
        this.redisClient.del(key);
    
        
        await this.userRepository.save({
            user_name,
            user_email,
            user_password: encryptPassword
        });
    
        return HttpStatus.OK;
    }
    

    async loginUser(data: loginRequestDto): Promise<loginResponseDto> {
        const { user_email, user_password } = data;
        const user = await this.userRepository.findOneBy({ user_email });
        
        if (!user) throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);

        const match = await compare(user_password, user.user_password);
        if (!match) throw new HttpException('INVALID_PASSWORD', HttpStatus.UNAUTHORIZED);

        const role = user.user_authority === 'STAFF' ? 'STAFF' : 'MANAGER';
        const payload = { authority: role, id: user.id };
        const secretKey = this.configService.get<string>('JWT_SECRETKEY');
    
        const accessToken = jwt.sign(payload, secretKey, { expiresIn: '1h' });
        const refreshToken = jwt.sign(payload, secretKey, { expiresIn: '1y' });
        

        await this.refreshRepository.save({
            refreshToken: refreshToken,
        });
        

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            user_authority : user.user_authority
        };
    }

    async getUsers() {
        return await this.userRepository.find({
            select: ['id', 'user_name', 'user_email', 'user_authority'],  // 비밀번호 제외하고 필드 선택
        });
    }
    
    async updateUser(request: CustomRequest, data: updateRequestDto) {
        try {
            const user = request.user as User;
            console.log(user);
    
            if (!user) {
                throw new UnauthorizedException('유저 정보를 찾을 수 없습니다');
            }
    
            // 비밀번호 필드가 있는 경우 해싱
            if (data.user_password) {
                const saltRounds = 10;
                data.user_password = await bcrypt.hash(data.user_password, saltRounds);
            }
    
            await this.userRepository.update(user.id, data);
            const updatedUser = await this.userRepository.findOne({ where: { id: user.id } });
    
            return updatedUser;
    
        } catch (error) {
            console.error('토큰 디코딩 실패:', error.message);
            throw new UnauthorizedException('토큰에서 사용자 ID를 추출할 수 없습니다');
        }
    }
    

    async DeleteUser(data: deleteRequestDto): Promise<any> {
        const { user_id } = data;
    
        try {
            // 사용자 찾기
            const user = await this.userRepository.findOne({ where: { id: user_id } });
    
            // 사용자가 없으면 오류 메시지 반환
            if (!user) {
                throw new HttpException('사용자가 없습니다', HttpStatus.NOT_FOUND);
            }
    
            // 사용자 삭제
            await this.userRepository.delete({ id: user_id });
    
            // 정상적으로 삭제되면 200 OK 반환
            return { message: `UserID : ${user_id} has been deleted successfully.`, statusCode: HttpStatus.OK };
        } catch (error) {
            // 예외 발생 시 로그 출력 및 예외 처리
            console.error('Error deleting user:', error);
            throw error;
        }
    }
    

    async encryptPassword(password: string) {
        const DEFAULT_SALT = 11;
        return hash(password, DEFAULT_SALT); // bcryptjs 사용
    }

    async onModuleInit() {
        const userExists = await this.userRepository.findOne({
          where: { user_email: 'admin@example.com' },
        });
    
        if (!userExists) {
            const adminPassword = process.env.ADMIN_PASSWORD;
            if (!adminPassword) {
              throw new Error('관리자 비밀번호가 환경 변수에 설정되지 않았습니다.');
            }
          
            const hashedPassword = await hash(adminPassword, 10);
          
            const adminUser = this.userRepository.create({
              user_name: process.env.ADMIN_NAME ,
              user_email: process.env.ADMIN_EMAIL,
              user_authority: UserAuthority.MANAGER,
              user_password: hashedPassword,
            });


          await this.userRepository.save(adminUser);
          console.log('Admin user created!');
        } else {
          console.log('Admin user already exists!');
        }
      }
}
