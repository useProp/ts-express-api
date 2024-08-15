import { HttpException } from './Http.exception';

export class UserNotFoundException extends HttpException {
  constructor() {
    super('User not found', 404);
  }
}