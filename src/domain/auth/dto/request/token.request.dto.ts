import { IsNotEmpty, IsString } from "class-validator";

export class tokenRequestDto{
    @IsNotEmpty()
    @IsString()
    refresh_token:string;

    @IsNotEmpty()
    @IsString()
    access_token:string
}