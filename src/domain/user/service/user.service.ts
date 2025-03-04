import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/user.entity';
import { Repository } from 'typeorm';
import { registerUserDto } from '../presentation/dto/register.user.dto';
import { loginUserDto } from '../presentation/dto/login.user.dto';
import * as jwt from 'jsonwebtoken'; // jsonwebtoken을 import
import { hash,compare } from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository:Repository<User>
    ){ }
    async createUser(data:registerUserDto){
        const{user_name,user_email,user_password} = data;

        const encryptPassword = await this.encryptPassword(user_password);

        return this.userRepository.save({
            user_name,
            user_email,
            user_password:encryptPassword
        })
    }
    
    
    async loginUser(date:loginUserDto){
        const{user_name,user_password} = data;

        const user = await this.userRepository.findOneBy({
            user_name,
        });

        if(!user) throw new HttpException('NOT_FOUND',HttpStatus.NOT_FOUND); //try catch 대신

        const match = await compare(user_password,user.password);

        if(!match)
            throw new HttpException('NOT_FOUND',HttpStatus.NOT_FOUND);

        const payload = {
            username,
            name:user.name
        }


        const accessToken = jwt.sign(payload,'secret_key',{
            expiresIn:'1h',
        });

        return{
            accessToken,
        }
    }
    
    async encryptPassword(password:string){
        const DEFAULT_SALT = 11;
        return hash(password,11)
    }
}

