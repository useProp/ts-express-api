import HttpException from './Http.exception';

class CategoryNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Category with id ${id} not found`);
  }
}

export default CategoryNotFoundException;