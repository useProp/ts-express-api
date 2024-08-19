import { Controller } from '../interfaces/controller.interface';
import { Router, Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source';
import { Category } from './category.entity';
import { HttpException } from '../exceptions/http.exception';
import { validationMiddleware } from '../middleware/validation.middleware';
import { CreateCategoryDto } from './category.dto';

export class CategoryController implements Controller {
  public path = '/categories';
  public router = Router();
  private categoriesRepo = AppDataSource.getRepository(Category);

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(`${this.path}`, this.getAll);
    this.router.get(`${this.path}/:id`, this.getOne);
    this.router.post(`${this.path}/`, validationMiddleware(CreateCategoryDto), this.create);
  }

  private getAll = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const categories = await this.categoriesRepo.find({ relations: ['posts'] });
      res.json({ categories });
   } catch (e) {
     next(new HttpException());
   }
  }

  private getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const category = await this.categoriesRepo.findOne({ where: { id: Number(id) }, relations: ['posts'] });
      if(!category) {
        return next(new HttpException(404, 'Category not found'));
      }

      res.json({ category });
    } catch (e) {
      next(new HttpException());
    }
  }

  private create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categoryData: CreateCategoryDto = req.body;
      const newCategory = this.categoriesRepo.create(categoryData);
      await this.categoriesRepo.save(newCategory);
      res
        .status(201)
        .json({ newCategory });
    } catch (e) {
      next(new HttpException());
    }
  }
}