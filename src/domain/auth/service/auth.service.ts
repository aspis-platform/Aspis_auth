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
    
    
    async findMe(request: any) {
        try {
          
          const userId = request.user_id.sub; 
          
          // 데이터베이스에서 사용자 정보 조회
          const user = await this.userRepository.findOne({ where: { id: userId } });
          if (!user) {
            throw new UnauthorizedException('사용자를 찾을 수 없습니다');
          }
          
          // 필요한 정보만 리턴
          return {
            id: user.id,
            email: user.user_email // 필드명은 실제 엔티티 구조에 맞게 조정
          };
        } catch (error) {
          throw new UnauthorizedException('인증에 실패했습니다: ' + error.message);
        }
      }
    


}

