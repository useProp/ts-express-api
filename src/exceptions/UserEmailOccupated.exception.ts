import { HttpException } from './Http.exception';

export class UserEmailOccupated extends HttpException {
  constructor(email: string) {
    super(`User with email ${email} already exists`, 400);
  }
}