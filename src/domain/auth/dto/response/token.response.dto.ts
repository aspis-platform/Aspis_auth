import { IsString } from 'class-validator';

export class TokenRequestDto {
    @IsString()
    refresh_token: string;
}
