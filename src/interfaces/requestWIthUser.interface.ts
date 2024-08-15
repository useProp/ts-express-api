import { Request } from 'express';
import { User } from '../users/user.interface';

export interface RequestWithUser extends Request {
  user: User;
}