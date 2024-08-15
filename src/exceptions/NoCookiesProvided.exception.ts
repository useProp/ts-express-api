import { HttpException } from './Http.exception';

export class NoCookiesProvidedException extends HttpException {
  constructor() {
    super('No Cookies Provided', 400);
  }
}