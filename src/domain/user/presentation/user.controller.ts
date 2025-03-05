import { Body, Controller, Get, Post, ValidationPipe } from "@nestjs/common";
import { UserService } from "../service/user.service";
import { registerUserDto } from "./dto/register.user.dto";
import { loginUserDto } from "./dto/login.user.dto";

@Controller('user')
export class UserController{
    constructor(
        private readonly UserService:UserService //UserService 파일과 연결
    ){}


    @Post()
    signup(
        @Body(new ValidationPipe()) data:registerUserDto
    ){
        return this.UserService.createUser
    }

    @Post()
    login(
        @Body(new ValidationPipe()) data:loginUserDto //login형식에 맞게 입력받도록 설정
    ){
        return this.UserService.loginUser
    }

    @Get()
    getUsers(){
        return this.UserService.getUser()
    }
}