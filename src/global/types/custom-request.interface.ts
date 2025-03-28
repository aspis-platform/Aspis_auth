import { Request } from 'express';
import { User } from 'src/domain/user/entity/user.entity';

export interface CustomRequest extends Request {  //Request 객체를 상속받은 새로운 인터페이스인 CustomRequest를 정의하는 것
  user: User;
}   