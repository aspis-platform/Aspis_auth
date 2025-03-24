import { IsNotEmpty, IsString } from "class-validator";

export class SetEmailRequestDto {
    @IsNotEmpty()
    @IsString()
    email: string;
}
