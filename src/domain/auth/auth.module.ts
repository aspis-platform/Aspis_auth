import { AuthController } from './presentation/auth.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '../../global/redis/redis.datasource';
import { AuthService } from './service/auth.service';
import { ConfigModule } from '@nestjs/config';
import { tbl_refreshToken } from './dto/entity/refresh.entity';
import { tbl_user } from '../user/entity/user.entity';
import { RolesGuard } from 'src/global/security/roles.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    RedisModule, 
    ConfigModule.forRoot(), // ✅ 여기 콤마 추가
    TypeOrmModule.forFeature([tbl_refreshToken,tbl_user]), // ✅ TypeORM 엔티티 등록
    JwtModule.register({
      secret: process.env.JWT_SECRET, // JWT 비밀 키
      signOptions: { expiresIn: '1h' }, // 만료 시간 설정 (예시: 1시간)
    }),
  ],
  providers: [AuthService,AuthController,RolesGuard],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule { }