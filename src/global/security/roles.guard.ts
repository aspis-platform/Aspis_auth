import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UserAuthority } from 'src/domain/user/entity/authority.enum';
import { ROLES_KEY } from './roles.decorator';
import { JwtPayload } from '../jwt/jwt-payload.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService
    //jwt가 유효한지 확인하는 코드 추가
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 컨트롤러나 핸들러에 설정된 필요 역할 가져오기
    const requiredRoles = this.reflector.getAllAndOverride<UserAuthority []>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 역할 제한이 없으면 접근 허용
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // 요청에서 JWT 토큰 추출
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('인증 토큰이 필요합니다');
    }
    
    const token = authHeader.substring(7);
    
    
    
    
  try  {
    // JWT 검증 및 페이로드 추출 (서명 검증 포함)
    const payload = this.jwtService.verify<JwtPayload>(token, {
      secret: process.env.JWT_SECRET, // 서명 검증을 위한 비밀 키
    });
    
    request.user = payload; // 요청 객체에 사용자 정보 추가
  
    // 사용자가 필요한 역할을 하나라도 가지고 있는지 확인
    const hasRequiredRole = requiredRoles.some(role => 
      payload.authority && payload.authority.includes(role)
    );
  
    if (!hasRequiredRole) {
      throw new ForbiddenException('이 작업을 수행할 권한이 없습니다');
    }
  
    return true;
  } catch (error) {
    if (error instanceof ForbiddenException) {
      throw error;
    }
    // 토큰 서명 및 페이로드 검증 실패시 UnauthorizedException 처리
    throw new UnauthorizedException('유효하지 않은 토큰입니다');
  }
  
    }
  }
