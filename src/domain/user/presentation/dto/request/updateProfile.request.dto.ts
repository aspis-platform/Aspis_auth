import { IsNotEmpty, IsString } from "class-validator";

export class updateProfileRequestDto{

    @IsNotEmpty()
   user_name:string
}