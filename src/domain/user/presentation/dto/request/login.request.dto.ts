//아이디 ,비번
import { IsEmail, IsNotEmpty, IsString } from "class-validator";


export class LoginRequestDto{
    @IsNotEmpty()
    @IsEmail()
    user_email:string;

    @IsNotEmpty()
    @IsString()
    user_password:string

}