import * as express from 'express';
import * as mongoose from 'mongoose';
import { errorMiddleware } from './middleware/error.middleware';

class App {
  public app: express.Application;
  public port: number;

  constructor(controllers, port: number) {
    this.app = express();
    this.port = port;

    this.connectToTheDatabase().then(() => console.log('Database Connected'));
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
  }

  private initializeControllers(controllers) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
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