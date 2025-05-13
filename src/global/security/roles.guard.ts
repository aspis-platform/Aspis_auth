import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UserAuthority } from 'src/domain/user/entity/authority.enum';
import { ROLES_KEY } from './roles.decorator';
import { JwtPayload } from '../jwt/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/domain/user/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesGuard implements CanActivate {// CanActivate요청이 처리되기 전에 해당 요청을 "허용할지" 또는 "거부할지" 결정하는 메서드를 정의
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    //jwt가 유효한지 확인하는 코드 추가
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> { //ExecutionContext을 사용하면 다음에 어떠한 라우트 핸들러가 실행되는지 알수있음
    // 컨트롤러나 핸들러에 설정된 필요 역할 가져오기
    const requiredRoles = this.reflector.getAllAndOverride<UserAuthority []>(ROLES_KEY, [
      context.getHandler(),   // 요청을 처리할 수 있는 컨트롤러 클래스에 대한 정보.
      context.getClass(),   //요청을 처리하는 메소드(핸들러)에 대한 정보.
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
    
    request.user = await this.userRepository.findOne({where : {
      id : payload.id  //JWT 토큰 페이로드에 userid를 가져와 해당하는 사용자의 정보를 조회
    }})
  
    // 사용자가 필요한 역할을 하나라도 가지고 있는지 확인
    let hasRequiredRole = false;
    
    if (Array.isArray(payload.authority)) {
      // 배열인 경우 includes를 사용
      hasRequiredRole = requiredRoles.some(role => 
        payload.authority && payload.authority.includes(role)
      );
    } else {
      // 문자열인 경우 각 role과 비교
      hasRequiredRole = requiredRoles.some(role => 
        payload.authority === role
      );
    }
  
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
