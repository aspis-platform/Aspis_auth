import { Controller, Post, Get, Delete, Body, Param, ValidationPipe } from '@nestjs/common';
import { RedisService } from '../service/email.service';
import { SetEmailResponseDto } from '../dto/response/setEmail.response.dto';
import { setEmailRequestDto } from '../dto/request/setEmail.request.dto';
import { DeleteEmailResponseDto } from '../dto/response/deleteEmail.response.dto';

@Controller('invite')
export class inviteController {
  constructor(private readonly redisService: RedisService) {}

  @Post('/set')
  async setEmail(@Body(new ValidationPipe) body:setEmailRequestDto):Promise<SetEmailResponseDto> {
    const key = await this.redisService.setEmail(body.email);
    return { message: 'Email saved successfully',key: key };
  }


  @Delete('delete/:key')
  async deleteEmail(@Param('key') key: string):Promise<DeleteEmailResponseDto> {
    await this.redisService.deleteEmail(key);
    return { message: 'Email deleted successfully' };
  }
}
