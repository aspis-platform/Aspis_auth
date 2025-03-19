import { Roles } from 'src/global/\bsecurity/roles.decorator';
import { tokenRequestDto } from '../dto/request/token.request.dto';
import { tokenResponseDto } from '../dto/response/token.response.dto';
import { AuthService } from '../service/auth.service';
import { Controller, Post, Get, Delete, Body, Param, HttpStatus, ValidationPipe } from '@nestjs/common';
import { UserAuthority } from 'src/domain/user/entity/authority.enum';

@Controller('/auth')
export class AuthController {
    constructor(private readonly AuthService: AuthService) { }
    
    
    @Post('/reissue')
    async setEmail(@Body(new ValidationPipe) body: tokenRequestDto): Promise<tokenResponseDto> {
        return this.AuthService.reissueToken(body.refresh_token)
    }
}
