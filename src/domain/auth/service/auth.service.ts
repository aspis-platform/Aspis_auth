import { HttpException, HttpStatus, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import Redis from 'ioredis';
import * as jwt from 'jsonwebtoken';
import { tokenResponseDto } from '../dto/response/token.response.dto';

@Injectable()
export class AuthService {
    private readonly secretKey = process.env.JWT_SECRETKEY 

    constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

    async reissueToken(refreshToken: string): Promise<tokenResponseDto> {
        // Redis에서 refreshToken 조회
        const redisReturnValue = await this.redisClient.get(refreshToken);
        if (!redisReturnValue) {
            throw new NotFoundException('Refresh token not found');
        }

        // Refresh Token 검증 및 페이로드 추출
        let payload;
        try {
            payload = jwt.verify(refreshToken, this.secretKey) as jwt.JwtPayload;
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Refresh token has expired');
            }
            throw new UnauthorizedException('Invalid refresh token');
        }

        const accessToken = jwt.sign(payload, this.secretKey, { expiresIn: '1h' });

        return { access_token: accessToken };
    }
}
