import Controller from '../interfaces/controller.interface';
import { NextFunction, Request, Response, Router } from 'express';
import PgDataSource from '../pg-data-source';
import addressEntity from './address.entity';


class AddressController implements Controller {
  public router = Router();
  public path = '/address';
  private addressRepo = PgDataSource.getRepository(addressEntity);

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.getAllAddresses);
  }

  private getAllAddresses = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const addresses = await this.addressRepo.find();
      res.json({ addresses });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
}

export default AddressController;