import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { UserAuthority } from "./authority.enum";

@Entity('user')
export class User{
    @PrimaryGeneratedColumn('uuid') //primarycolumn으로 하면 내가 직접 설정 해주어야함
    id:number;

    @Column()
    user_name:string;

    @Column()
    user_email:string;

    @Column({ //유저와 관리자 구분
        type: "enum",
        enum: UserAuthority,
        default: UserAuthority.USER //기본값을 user로 설정
    })
    user_authority: UserAuthority;

    @Column()
    user_password:string;
}