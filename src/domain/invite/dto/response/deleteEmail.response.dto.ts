import { IsNotEmpty, IsString } from "class-validator";

export class DeleteEmailResponseDto {
    @IsNotEmpty()
    @IsString()
    message: string;
}
