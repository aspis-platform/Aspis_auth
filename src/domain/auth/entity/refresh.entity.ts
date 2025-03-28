import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('tbl_refresh_token')
export class tbl_refreshToken {
    @PrimaryGeneratedColumn('uuid') 
    id: string;

    @Column()
    refreshToken: string; 
}
