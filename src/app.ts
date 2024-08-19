import * as express from 'express';
import { Request, Response, NextFunction } from 'express'
import * as mongoose from 'mongoose';
import { errorMiddleware } from './middleware/error.middleware';
import * as cookieParser from 'cookie-parser';
import { Controller } from './interfaces/controller.interface';

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
    // health check
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
    this.app.use('/health', (req: Request, res: Response, next: NextFunction) => {
      res.json({ message: 'OK' });
    });
  }

  private async connectToTheDatabase() {
    await mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}${process.env.MONGO_PATH}`);
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Server running on port: ${this.port}`);
    });
  }
}

export default App;