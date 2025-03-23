import { Request } from 'express';
import { User } from 'src/domain/user/entity/user.entity';

export interface CustomRequest extends Request {
  user: User;
}