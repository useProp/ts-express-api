import { Controller } from '../interfaces/controller.interface';
import { NextFunction, Router, Request, Response } from 'express';
import { HttpException } from '../exceptions/http.exception';
import { AppDataSource } from '../data-source';
import { Address } from './address.entity';

export class AddressController implements Controller {
  public path = '/addresses';
  public router = Router();
  private addressesRepo = AppDataSource.getRepository(Address);

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.get(`${this.path}`, this.getAllAddresses);
  }

  private getAllAddresses = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const addresses = await this.addressesRepo.find({ relations: ['user'] });
      res.json({ addresses })
    } catch (e) {
      next(new HttpException());
    }
  }

}