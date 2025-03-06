import { Controller, Post, Get, Delete, Body, Param, HttpStatus } from '@nestjs/common';
import { RedisService } from '../service/email.service';

@Controller('redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @Post('/set')
  async setEmail(@Body() body: { email: string }) {
    const key = await this.redisService.setEmail(body.email);
    return { message: 'Email saved successfully',key: key };
  }

  @Get('get/:key')
  async getAndDeleteEmail(@Param('key') key: string){
    const entity = await this.redisService.getAndDeleteEmail(key);
    return entity ? entity : HttpStatus.NOT_FOUND
  }

  @Delete('delete/:key')
  async deleteEmail(@Param('key') key: string) {
    await this.redisService.deleteEmail(key);
    return { message: 'Email deleted successfully' };
  }
}
