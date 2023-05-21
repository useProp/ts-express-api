import * as express from 'express';
import * as process from 'process';
import errorMiddleware from './middleware/error.middleware';
import Controller from './interfaces/controller.interface';
import * as cookieParser from 'cookie-parser';
import loggerMiddleware from './middleware/logger.middleware';
import PgDataSource from './pg-data-source';

class App {
  public app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();

    this.connectToDatabase().then(() => {
      this.initializeMiddlewares();
      this.initializeControllers(controllers);
      this.initializeErrorHandling();
      this.listen();
    });
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(loggerMiddleware)
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeControllers(controllers) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  private async connectToDatabase() {
    try {
      await PgDataSource.initialize();
      console.log('Database connected');
    } catch (e) {
      console.log(e);
      process.exit(1);
    }
  }

  public listen() {
    console.log('try to listen')
    this.app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  }
}

export default App;