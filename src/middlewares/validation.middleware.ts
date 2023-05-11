import { Request, Response, NextFunction, RequestHandler } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import HttpException from '../exceptions/HttpException';

const validationMiddleware = <T>(type: any, skipMissingProperties = false): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    validate(plainToInstance(type, req.body), { skipMissingProperties })
      .then((errors: ValidationError[]) => {
        if (errors.length > 0) {
          const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');
          return next(new HttpException(400, message));
        }
        next();
      });
  }
}

export default validationMiddleware;