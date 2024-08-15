import { HttpException } from './Http.exception';

export class WrongCredentials extends HttpException {
  constructor() {
    super('Wrong credentials', 401);
  }
}