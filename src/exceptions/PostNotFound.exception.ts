import { HttpException } from './Http.exception';

class PostNotFoundException extends HttpException {
  constructor(id: string) {
      super(`Post with id ${id} not found`, 404);
  }
}

export { PostNotFoundException };