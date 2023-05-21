import { Router, Request, Response, NextFunction } from 'express';
import Controller from '../interfaces/controller.interface';
import userModel from '../users/user.model';


class ReportController implements Controller {
  public path = '/report';
  public router = Router();
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(`${this.path}`, this.generateReports);
  }

  private generateReports = async (req: Request, res: Response, next: NextFunction) => {
    const usersByCountries = await this.user.aggregate([
      {
        $match: {
          'address.city': {
            $exists: true,
          }
        }
      },
      {
        $group: {
          _id: {
            city: '$address.city',
          },
          users: {
            $push: {
              _id: '$_id',
              name: '$name',
            }
          },
          count: {
            $sum: 1,
          }
        },
      },
      {
        $lookup: {
          from: 'posts',
          localField: 'users._id',
          foreignField: 'author',
          as: 'articles',
        }
      },
      {
        $addFields: {
          amountOfArticles: {
            $size: '$articles'
          }
        }
      },
      {
        $sort: {
          amountOfArticles: 1,
        }
      }
  ]);
    res.json({ usersByCountries });
  }
}

export default ReportController;