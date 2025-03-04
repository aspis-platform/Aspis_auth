import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class User{
    @PrimaryColumn()
    id:number;

    @Column()
    user_name:string;

    @Column()
    user_email:string;

    @Column()
    user_authority:string;

    @Column()
    password:string;
}