import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class registerUserDto{
   
    @IsNotEmpty()
    @IsString()
    user_name:string;

    @IsNotEmpty()
    user_email:string;

    
    @IsNotEmpty()
    @IsString()
    key:string; //회원가입 할때 key를 왜 입력??
   
    @IsNotEmpty()
    @IsString()
    user_password:string;
}