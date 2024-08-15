import { HttpException } from './Http.exception';

export class WrongTokenException extends HttpException {
  constructor() {
    super('Wrong Token', 401);
  }
}