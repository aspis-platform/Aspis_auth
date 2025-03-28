import { JwtPayload } from './../../../global/jwt/jwt-payload.interface';
import { Inject, Injectable, NotFoundException, Req, UnauthorizedException } from '@nestjs/common';
import Redis from 'ioredis';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { tbl_refreshToken } from '../dto/entity/refresh.entity';
import { Repository } from 'typeorm';
import { tbl_user } from 'src/domain/user/entity/user.entity';
import { CustomRequest } from 'src/global/types/custom-request.interface';

@Injectable()
export class AuthService {
    jwtService: any;

    constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    private readonly configService: ConfigService,
    @InjectRepository(tbl_refreshToken)
    private refreshRepository: Repository<tbl_refreshToken>,
    @InjectRepository(tbl_user)
    private userRepository: Repository<tbl_user>,
) {}


    private secretKey = this.configService.get<string>('JWT_SECRETKEY');
    
    async reissueToken(refreshToken: string): Promise<{ access_token: string }> {

        const JWT_PROPERTIES = {
            HEADER: 'Authorization',
            PREFIX: 'Bearer ',
            ACCESS: 'access',
            REFRESH: 'refresh',
            AUTHORITY: 'authority'
          };
        
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

        const accessTokenOptions: jwt.SignOptions = {
            algorithm: 'HS256',
            header: {
                typ: JWT_PROPERTIES.ACCESS,
                alg: 'HS256'  // 여기에 알고리즘을 명시적으로 지정
            },
            expiresIn: '1h'
        };
        
        const accessToken = jwt.sign(payloadWithoutExp, this.secretKey, accessTokenOptions);
    
        return { access_token: accessToken };
    }
    
    
    async findMe(@Req() request: CustomRequest) {
        try {
            const user = request.user as tbl_user;
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

