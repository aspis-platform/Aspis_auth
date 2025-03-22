import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import Redis from 'ioredis';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { refreshToken } from '../dto/entity/refresh.entity';
import { Repository } from 'typeorm';
import { User } from 'src/domain/user/entity/user.entity';

@Injectable()
export class AuthService {

    constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    private readonly configService: ConfigService,
    @InjectRepository(refreshToken)
    private refreshRepository: Repository<refreshToken>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
) {}


    
    private secretKey = this.configService.get<string>('JWT_SECRETKEY');
    
    async reissueToken(refreshToken: string): Promise<{ access_token: string }> {
        
        const tokenEntity = await this.refreshRepository.findOne({ where: { refreshToken } });
    
        if (!tokenEntity) {
            throw new NotFoundException('Refresh token not found');
        }
    
        
        let payload;
        try {
            payload = jwt.verify(refreshToken, this.secretKey) as jwt.JwtPayload;
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Refresh token has expired');
            }
            throw new UnauthorizedException('Invalid refresh token');
        }
    
        
        const { exp, ...payloadWithoutExp } = payload;
    
        
        const accessToken = jwt.sign(payloadWithoutExp, this.secretKey, { expiresIn: '1h' });
    
        return { access_token: accessToken };
    }
    

  // 유저 정보 조회
  async getUserInfo(user_name: string): Promise<{ user_name: string, user_email: string }> {
    const user = await this.userRepository.findOne({ where: { user_name: user_name } });
    if (!user) {
        throw new NotFoundException('User not found');
    }

    // 필요한 데이터만 반환
    return { 
        user_name: user.user_name, 
        user_email: user.user_email 
    };
    }
}
