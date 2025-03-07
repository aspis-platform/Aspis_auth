import { IsNotEmpty, IsString } from "class-validator";

export class SetEmailResponseDto {
    @IsNotEmpty()
    @IsString()
    message: string;

    @IsNotEmpty()
    @IsString()
    key: string;
}
