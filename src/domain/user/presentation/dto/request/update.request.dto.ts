import { IsNotEmpty, IsString } from "class-validator";

export class updateRequestDto{
    @IsNotEmpty()
    user_name:string

    @IsNotEmpty()
    user_email:string

    @IsNotEmpty()
    user_password:string

}