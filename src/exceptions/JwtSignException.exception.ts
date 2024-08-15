import { HttpException } from './Http.exception';

export class JwtSignException extends HttpException {
  constructor() {
    super('JWT Sign Exception', 500);
  }
}