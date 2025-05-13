import { Roles } from 'src/global/security/roles.decorator';
import { TokenRequestDto } from '../dto/request/token.request.dto';
import { AuthService } from '../service/auth.service';
import { Controller, Post, Get, Body, ValidationPipe,  Req } from '@nestjs/common';
import { UserAuthority } from 'src/domain/user/entity/authority.enum';
import { CustomRequest } from 'src/global/types/custom-request.interface';

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
    @Roles(UserAuthority.MANAGER,UserAuthority.STAFF)
    async findMe(@Req() request: CustomRequest) {
        return await this.AuthService.findMe(request);  
    }
}
