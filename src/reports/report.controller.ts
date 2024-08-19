import { Controller } from '../interfaces/controller.interface';
import { NextFunction, Router, Request, Response } from 'express';
import { UserModel } from '../users/user.model';

export class ReportController implements Controller {
  public path = '/reports';
  public router = Router();
  private user = UserModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(`${this.path}`, this.generateReport);
  }

  private generateReport = async (req: Request, res: Response, next: NextFunction) => {
    const report = await this.user.aggregate([
      {
        $match: {
          'address.country': {
            $exists: true,
          }
        },
      },{
        $group: {
          _id: {
            country: '$address.country',
          },
          users: {
            $push: {
              _id: '$_id',
              name: "$name"
            }
          }
        }
      },{
        $lookup: {
          from: 'posts',
          localField: 'users._id',
          foreignField: 'author',
          as: 'posts',
        }
      }
    ]);
    res.json({
      report
    });
  }
}