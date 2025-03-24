//아이디 ,비번
import { IsNotEmpty, IsString } from "class-validator";
import { UserAuthority } from "src/domain/user/entity/authority.enum";

export class LoginRequestDto{
    @IsNotEmpty()
    user_email:string;

    @IsNotEmpty()
    @IsString()
    user_password:string

}