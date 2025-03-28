import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { UserAuthority } from "./authority.enum";
import { matches } from "class-validator";

@Entity('tbl_user')
export class tbl_user{
    @PrimaryGeneratedColumn('uuid') //primaryColumn으로 하면 내가 직접 설정 해주어야함
    id:string;

    @Column()
    user_name:string;

    @Column()
    user_email:string;

    @Column({ //유저와 관리자 구분
        type: "enum",
        enum: UserAuthority,
        default: UserAuthority.STAFF //기본값을 user로 설정
    })
    user_authority: UserAuthority;

    @Column() // 정규식 추가 
    user_password:string;
}