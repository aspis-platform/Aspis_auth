import { JwtPayload } from './../../../global/jwt/jwt-payload.interface';
import { Inject, Injectable, NotFoundException, Req, UnauthorizedException } from '@nestjs/common';
import Redis from 'ioredis';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from '../dto/entity/refresh.entity';
import { Repository } from 'typeorm';
import { User } from 'src/domain/user/entity/user.entity';
import { CustomRequest } from 'src/global/types/custom-request.interface';

@Injectable()
export class AuthService {
    jwtService: any;

    constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    private readonly configService: ConfigService,
    @InjectRepository(RefreshToken)
    private refreshRepository: Repository<RefreshToken>,
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
    
    
    async findMe(@Req() request: CustomRequest) {
        try {
            const user = request.user as User;
            console.log(user);
    
            if (!user) {
                throw new UnauthorizedException('유저 정보를 찾을 수 없습니다');
            }
    
            return { userId: user.id,
                userEmail: user.user_email,
                userName: user.user_name
            };
        } catch (error) {
            console.error('토큰 디코딩 실패:', error.message);
            throw new UnauthorizedException('토큰에서 사용자 ID를 추출할 수 없습니다');
        }
    }
    
    
    
    
    
    
    
    

}

