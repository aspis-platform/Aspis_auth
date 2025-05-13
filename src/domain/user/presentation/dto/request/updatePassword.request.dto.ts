import { IsNotEmpty, IsString, IsStrongPassword } from "class-validator"

export class updatePasswordRequestDto{

@IsNotEmpty()
@IsString()
user_old_password: string

@IsStrongPassword({
    minLength: 10,         // 최소 10자
    minNumbers: 2,        // 최소 2개의 숫자
    minSymbols: 1,        // 최소 1개의 특수문자
  })


@IsString()
@IsStrongPassword()
@IsNotEmpty()
user_new_password:string 
}