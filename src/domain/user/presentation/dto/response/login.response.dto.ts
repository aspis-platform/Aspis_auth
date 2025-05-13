import { IsNotEmpty, IsString } from "class-validator";
import { UserAuthority } from "src/domain/user/entity/authority.enum";

export class loginResponseDto{
    @IsNotEmpty()
    @IsString()
    refresh_token:string;

    @IsNotEmpty()
    @IsString()
    access_token:string


    @IsNotEmpty()
    @IsString()
    user_authority: UserAuthority;
}