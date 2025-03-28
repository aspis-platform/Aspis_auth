import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('tbl_refresh_token')
export class RefreshToken {
    @PrimaryGeneratedColumn('uuid') 
    id: string;

    @Column()
    refreshToken: string; 
}
