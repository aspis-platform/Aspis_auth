//아이디 ,비번
import { IsEmail, IsNotEmpty, IsString } from "class-validator";


export class LoginRequestDto{
    @IsNotEmpty({
        message: '값이 입력되지 않았습니다.'
    })
    @IsEmail({},{
        message:'정확한 이메일을 입력해주세요'
    })
    user_email:string;

    @IsNotEmpty()
    @IsString()
    user_password:string

}