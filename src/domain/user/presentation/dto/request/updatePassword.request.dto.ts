import { IsNotEmpty, IsString } from "class-validator"

export class updatePasswordRequestDto{

@IsNotEmpty()
@IsString()
user_old_password: string

@IsString()
user_new_password:string //비밀번호를 무조건 수정 안해도됨
}