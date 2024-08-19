import { NextFunction, Request, Response } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { HttpException } from '../exceptions/http.exception';

function validationMiddleware<T>(type: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const errors = await validate(plainToInstance(type, req.body));
    const err = errors.map((e: ValidationError) => Object.values(e.constraints).join(', '));
    if (err.length > 0) {
      next(new HttpException(400, `${err}`,));
      return;
    }
    next();
  }
}

export { validationMiddleware };