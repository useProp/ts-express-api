import Controller from '../interfaces/controller.interface';
import { NextFunction, Router, Request, Response } from 'express';
import PgDataSource from '../pg-data-source';
import Category from './category.entity';
import validationMiddleware from '../middleware/validation.middleware';
import CreateCategoryDto from './category.dto';
import CategoryNotFoundException from '../exceptions/CategoryNotFound.exception';
import CategoryAlreadyExistsException from '../exceptions/CategoryAlreadyExists.exception';

class CategoryController implements Controller {
  public path = '/categories';
  public router = Router();
  private categoryRepo = PgDataSource.getRepository(Category);

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.getAllCategories);
    this.router.get(`${this.path}/:id`, this.getCategoryById);
    this.router.post(`${this.path}`, validationMiddleware(CreateCategoryDto), this.createCategory);
  }

  private createCategory = async (req: Request, res: Response, next: NextFunction) => {
    const categoryData: CreateCategoryDto = req.body;

    const isNameAvailable = await this.categoryRepo.findOneBy({ name: categoryData.name });
    if (isNameAvailable) {
      return next(new CategoryAlreadyExistsException(categoryData.name));
    }

    const newCategory = this.categoryRepo.create(categoryData)
    await this.categoryRepo.save(newCategory);

    res.json({ newCategory });
  }

  private getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
    const categories = await this.categoryRepo.find({ relations: ['posts'] });
    res.json({ categories });
  }

  private getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const category = await this.categoryRepo.findOneBy({ id: Number(id) });
    if (!category) {
      return next(new CategoryNotFoundException(id));
    }

    res.json({ category });
  }
}

export default CategoryController;