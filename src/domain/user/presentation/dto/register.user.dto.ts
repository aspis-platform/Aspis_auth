import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class registerUserDto{
   
    @IsNotEmpty()
    @IsString()
    user_name:string;
   
    @IsNotEmpty()    
    user_email:string;
   
    @IsNotEmpty()
    @IsString()
    user_password:string;
}