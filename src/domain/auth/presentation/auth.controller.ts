import { Roles } from 'src/global/security/roles.decorator';
import { TokenRequestDto } from '../dto/request/token.request.dto';
import { AuthService } from '../service/auth.service';
import { Controller, Post, Get, Delete, Body, Param, HttpStatus, ValidationPipe, Patch, Query } from '@nestjs/common';
import { UserAuthority } from 'src/domain/user/entity/authority.enum';
import { promises } from 'dns';
import { findMeRequestDto } from '../dto/request/find.request.dto';

@Controller('/auth')
export class AuthController {
    constructor(private readonly AuthService: AuthService) { }
    
    
    @Post('/reissue')
    async reissueToken(
        @Body(new ValidationPipe()) body: TokenRequestDto): Promise<{ access_token: string }> {
        return this.AuthService.reissueToken(body.refresh_token);
    }


    
    
  @Get('/me')
  @Roles(UserAuthority.MANAGER,UserAuthority.STAFF)
  async getUserInfo(@Param('user_name') user_name: string): Promise<findMeRequestDto> {
    return this.AuthService.getUserInfo(user_name); // 서비스에서 유저 정보 반환
  }
}

