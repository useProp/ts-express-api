import { HttpException } from './Http.exception';

export class ServerException extends HttpException {
  constructor() {
    super('Something went wrong', 500);
  }
}