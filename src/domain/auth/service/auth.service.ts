import { Inject, Injectable, NotFoundException, Req, UnauthorizedException } from '@nestjs/common';
import Redis from 'ioredis';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from '../entity/refresh.entity';
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
    
    private readonly JWT_PROPERTIES = {
        HEADER: 'Authorization',
        PREFIX: 'Bearer ',
        ACCESS: 'access',
        REFRESH: 'refresh',
        AUTHORITY: 'authority'
    };
    
    async reissueToken(refreshToken: string): Promise<{ access_token: string }> {
        const tokenEntity = await this.refreshRepository.findOne({ where: { refreshToken } });
    
        if (!tokenEntity) {
            throw new NotFoundException('리프레시 토큰을 찾을 수 없습니다');
        }
    
        let payload;
        try {
            payload = jwt.verify(refreshToken, this.secretKey) as jwt.JwtPayload;
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                await this.refreshRepository.delete({ refreshToken });
                throw new UnauthorizedException('리프레시 토큰이 만료되었습니다');
            }
            throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다');
        }
        
        const user = await this.userRepository.findOne({ where: { id: payload.id } });
        
        if (!user) {
            await this.refreshRepository.delete({ refreshToken });
            throw new UnauthorizedException('사용자를 찾을 수 없습니다');
        }
        
        const newPayload = {
            id: user.id,
            authority: user.user_authority
        };
        
        const accessTokenOptions: jwt.SignOptions = {
            algorithm: 'HS256',
            header: {
                typ: this.JWT_PROPERTIES.ACCESS,
                alg: 'HS256'
            },
            expiresIn: '1h'
        };
        
        const accessToken = jwt.sign(newPayload, this.secretKey, accessTokenOptions);
    
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