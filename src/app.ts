import * as express from 'express';
import { Request, Response, NextFunction } from 'express'
import { errorMiddleware } from './middleware/error.middleware';
import * as cookieParser from 'cookie-parser';
import { Controller } from './interfaces/controller.interface';
import { AppDataSource } from './data-source';

class App {
  public app: express.Application;
  public port: number;

  constructor(controllers: Controller[], port: number) {
    this.app = express();
    this.port = port;

    this.connectToTheDatabase().then(() => console.log('Database Connected'));
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(cookieParser());
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
    this.app.use('/health', (req: Request, res: Response, next: NextFunction) => {
      res.json({ message: 'OK' });
    });
  }

  private async connectToTheDatabase() {
    await AppDataSource.initialize();
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  public getServer() {
    return this.app;
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Server running on port: ${this.port}`);
    });
  }
}

export default App;