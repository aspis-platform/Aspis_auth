import { IsNotEmpty, IsString } from "class-validator";

export class deleteUserDto{
    @IsNotEmpty()
   user_name:string
}