//아이디 ,비번
import { IsNotEmpty, IsString } from "class-validator";


export class LoginRequestDto{
    @IsNotEmpty()
    user_email:string;

    @IsNotEmpty()
    @IsString()
    user_password:string

}