import HttpException from './Http.exception';

class CategoryAlreadyExistsException extends HttpException {
  constructor(name: string) {
    super(400, `Category with name: ${name} already exists`);
  }
}

export default CategoryAlreadyExistsException;
