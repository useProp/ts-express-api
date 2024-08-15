import 'dotenv/config';
import App from './app';
import validateEnv from './utils/validateEnv';
import {
  AuthenticationController
} from './authentication/authentication.controller';
import { UserController } from './users/user.controller';
import PostController from './posts/post.controller';

validateEnv();

const main = async () => {
  try {
    const app = new App(
      [
        new PostController(),
        new AuthenticationController(),
        new UserController()
      ],
      Number(process.env.PORT) || 5000,
    );
    app.listen();
  } catch (e) {
    console.log(e);
    process.exit(1)
  }
}

main();