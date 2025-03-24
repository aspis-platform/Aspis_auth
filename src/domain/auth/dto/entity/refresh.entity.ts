import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('refresh_token')
export class RefreshToken {
    @PrimaryGeneratedColumn('uuid') 
    id: string;

    @Column()
    refreshToken: string; 
}
