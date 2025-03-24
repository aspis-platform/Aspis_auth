import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class RegisterRequestDto{
   
    @IsNotEmpty()
    @IsString()
    user_name:string;
    
    @IsNotEmpty()
    @IsString()
    key:string;
   
    @IsNotEmpty()
    @IsString()
    user_password:string;
}