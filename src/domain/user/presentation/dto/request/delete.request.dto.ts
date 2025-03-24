import { IsNotEmpty, IsString } from "class-validator";

export class DeleteRequestDto{
    @IsNotEmpty()
   user_id:string
}