import { Controller, Post, Get, Delete, Body, Param, ValidationPipe } from '@nestjs/common';
import { InviteService } from '../service/invite.service';
import { SetEmailResponseDto } from '../dto/response/setEmail.response.dto';
import { SetEmailRequestDto } from '../dto/request/setEmail.request.dto';
import { DeleteEmailResponseDto } from '../dto/response/deleteEmail.response.dto';
import { Roles } from 'src/global/security/roles.decorator';
import { UserAuthority } from 'src/domain/user/entity/authority.enum';

@Controller('invite')
export class inviteController {
  constructor(private readonly InviteService: InviteService) {}

  @Roles(UserAuthority.MANAGER)
  @Post('/set')
  async setEmail(@Body(new ValidationPipe) body:SetEmailRequestDto):Promise<SetEmailResponseDto> {
    const key = await this.InviteService.setEmail(body.email);
    return { message: 'Email saved successfully',key: key };
  }

  @Roles(UserAuthority.MANAGER) 
  @Get('list')
  async getAllUsers(): Promise<any[]> {
    return this.InviteService.getAllUsers();
}

  
  @Roles(UserAuthority.MANAGER) 
  @Delete('delete/:key')
  async deleteEmail(@Param('key') key: string):Promise<DeleteEmailResponseDto>
   {
    await this.InviteService.deleteEmail(key);
    return { message: 'Email deleted successfully' };
  }
}
