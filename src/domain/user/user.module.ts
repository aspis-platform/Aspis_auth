import { Module } from '@nestjs/common';
import { UserService } from '../user/service/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/user.entity';
import { UserController } from './presentation/user.controller';

@Module({
  imports:[TypeOrmModule.forFeature([User])],  //NestJS의 TypeORM 모듈을 특정 엔티티(User)와 함께 현재 모듈에서 사용할 수 있도록 등록하는 역할(필수)
  providers: [UserService],
  controllers:[UserController],
  exports:[UserService]
})
export class UserModule {}
export{User}