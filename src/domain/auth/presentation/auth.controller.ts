import { Roles } from 'src/global/security/roles.decorator';
import { TokenRequestDto } from '../dto/request/token.request.dto';
import { AuthService } from '../service/auth.service';
import { Controller, Post, Get, Delete, Body, Param, HttpStatus, ValidationPipe, Patch, Query, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { UserAuthority } from 'src/domain/user/entity/authority.enum';
import { RolesGuard } from 'src/global/security/roles.guard';
import { findMeRequestDto } from '../dto/request/find.request.dto';

@Controller('/auth')
export class AuthController {
    jwtService: any;
    constructor(private readonly AuthService: AuthService) { }
    
    
    @Post('/reissue') //refresh토큰을 입력받고 accessToken반환
    async reissueToken(
        @Body(new ValidationPipe()) body: TokenRequestDto): Promise<{ access_token: string }> {
        return this.AuthService.reissueToken(body.refresh_token);
    }
    
    
    @Get('/me')
    async findMe(@Req() request: Request) {
      // 헤더에서 JWT 토큰 추출 (Authorization: Bearer <token>)
      const token = request.headers['authorization']?.split(' ')[1];
  
      if (!token) {
        throw new UnauthorizedException('Authorization token is missing');
      }
  
      try {
        // 토큰을 AuthService로 넘기기
        return await this.AuthService.findMe(token);  // AuthService로 토큰 전달
      } catch (error) {
        throw new UnauthorizedException('Invalid or expired token');
      }
    }
}
