import { Body, Controller, Delete, Get, HttpStatus, Patch, Post, Req, ValidationPipe } from "@nestjs/common";
import { UserService } from "../service/user.service";
import { DeleteRequestDto } from "./dto/request/delete.request.dto";
import { LoginRequestDto } from "./dto/request/login.request.dto";
import { RegisterRequestDto } from "./dto/request/register.request.dto";
import { loginResponseDto } from "./dto/response/login.response.dto";
import { Roles } from "src/global/security/roles.decorator";
import { UserAuthority } from "../entity/authority.enum";
import { updateRequestDto } from "./dto/request/update.request.dto";
import { User } from "../entity/user.entity";
import { CustomRequest } from "src/global/types/custom-request.interface";

@Controller('user') // s 추가하면 restful하게 짤 수 있음 
export class UserController {
    constructor(
        private readonly UserService: UserService //UserService 파일과 연결
    ) {}

    @Post('/register')
    async signup(
        @Body(new ValidationPipe()) data: RegisterRequestDto
    ) {
        const result = await this.UserService.createUser(data);
        return result
    }

    @Post('/login')
    async login(
        @Body(new ValidationPipe()) data: LoginRequestDto // login형식에 맞게 입력받도록 설정
    ):Promise<loginResponseDto> {
        const result = await this.UserService.loginUser(data);
        return result;  // 로그인 시 토큰 반환
    }

    @Roles(UserAuthority.MANAGER)
    @Delete('/delete')
    async delete(
        @Body(new ValidationPipe()) data:DeleteRequestDto
    ){
        const result = await this.UserService.DeleteUser(data);
        return result
    }


    @Roles(UserAuthority.MANAGER,UserAuthority.STAFF) // 자기 정보 수정하는 코드
    @Patch('/update')
    async update(
        @Body(new ValidationPipe()) data:updateRequestDto,
        @Req() request: CustomRequest) {
        return await this.UserService.updateUser(request,data);  
    }



    @Roles(UserAuthority.MANAGER)
    @Get()
    async getUsers() {
        return this.UserService.getUsers();
    }


}
