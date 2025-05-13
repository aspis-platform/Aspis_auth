import { JwtPayload } from './../../../global/jwt/jwt-payload.interface';
import { Inject, Injectable, NotFoundException, Req, UnauthorizedException } from '@nestjs/common';
import Redis from 'ioredis';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { refreshToken } from '../dto/entity/refresh.entity';
import { Repository } from 'typeorm';
import { User } from 'src/domain/user/entity/user.entity';
import { CustomRequest } from 'src/global/types/custom-request.interface';

@Injectable()
export class AuthService {
    jwtService: any;

    constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    private readonly configService: ConfigService,
    @InjectRepository(refreshToken)
    private refreshRepository: Repository<refreshToken>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
) {}


    
    private secretKey = this.configService.get<string>('JWT_SECRETKEY');
    
    async reissueToken(refreshToken: string): Promise<{ access_token: string }> {
        // 데이터베이스에서 리프레시 토큰 확인
        const tokenEntity = await this.refreshRepository.findOne({ where: { refreshToken } });
    
        if (!tokenEntity) {
            throw new NotFoundException('리프레시 토큰을 찾을 수 없습니다');
        }
    
        // JWT 토큰 검증
        let payload;
        try {
            payload = jwt.verify(refreshToken, this.secretKey) as jwt.JwtPayload;
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                // 만료된 토큰이면 DB에서도 삭제
                await this.refreshRepository.delete({ refreshToken });
                throw new UnauthorizedException('리프레시 토큰이 만료되었습니다');
            }
            throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다');
        }
        
        // 사용자 ID로 최신 사용자 정보 조회
        const user = await this.userRepository.findOne({ where: { id: payload.id } });
        
        if (!user) {
            // 해당 사용자가 없으면 토큰 삭제
            await this.refreshRepository.delete({ refreshToken });
            throw new UnauthorizedException('사용자를 찾을 수 없습니다');
        }
        
        // 새로운 페이로드 생성 (최신 정보 사용)
        const newPayload = {
            id: user.id,
            authority: user.user_authority
        };
        
        // 새 액세스 토큰 발급
        const accessToken = jwt.sign(newPayload, this.secretKey, { expiresIn: '1h' });
    
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
