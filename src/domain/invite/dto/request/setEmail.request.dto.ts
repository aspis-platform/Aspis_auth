import { IsNotEmpty, IsString } from "class-validator";

export class setEmailRequestDto {
    @IsNotEmpty()
    @IsString()
    email: string;
}
