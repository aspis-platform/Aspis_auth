//아이디 ,비번
import { IsNotEmpty, IsString } from "class-validator";

export class loginUserDto{
    @IsNotEmpty()
    user_name:string;

    @IsNotEmpty()
    @IsString()
    user_password:string
}