import { IsNotEmpty, IsString } from "class-validator";

export class tokenResponseDto{
    @IsNotEmpty()
    @IsString()
    access_token:string
}