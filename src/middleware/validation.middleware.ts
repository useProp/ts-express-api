import { Request, Response, NextFunction, RequestHandler } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import HttpException from '../exceptions/Http.exception';

const validationMiddleware = <T>(type: any, skipMissingProperties = false): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors: ValidationError[] = await validate(plainToInstance(type, req.body), {
        skipMissingProperties,
        forbidUnknownValues: false,
      });

      if (errors.length <= 0) {
        return next();
      }

      const message = errors.map((error: ValidationError) => Object.values(
        error?.constraints || error.children[0]?.constraints) || []
      ).join(', ');
      return next(new HttpException(400, message));
    } catch (e) {
      console.log(e);
      next(new HttpException(500, 'Server error'));
    }
  }
}

export default validationMiddleware;