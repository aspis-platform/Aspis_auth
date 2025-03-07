import { Body, Controller, Delete, Get, HttpStatus, Post, ValidationPipe } from "@nestjs/common";
import { UserService } from "../service/user.service";
import { registerUserDto } from "./dto/register.user.dto";
import { loginUserDto } from "./dto/login.user.dto";
import { deleteUserDto } from "./dto/delete.user.dto";

@Controller('user')
export class UserController {
    constructor(
        private readonly UserService: UserService //UserService 파일과 연결
    ) {}

    @Post('/register')
    async signup(
        @Body(new ValidationPipe()) data: registerUserDto
    ) {
        const result = await this.UserService.createUser(data);
        return result
    }

    @Post('/login')
    async login(
        @Body(new ValidationPipe()) data: loginUserDto // login형식에 맞게 입력받도록 설정
    ) {
        const result = await this.UserService.loginUser(data);
        return result;  // 로그인 시 토큰 반환
    }


    @Delete('/delete')
    async delete(
        @Body(new ValidationPipe()) data:deleteUserDto
    ){
        const result = await this.UserService.DeleteUser(data);
        return result
    }


    @Get()
    async getUsers() {
        return this.UserService.getUser();
    }
}
