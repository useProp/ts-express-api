import 'dotenv/config';
import App from './app';
import PostController from './post/post.controller';
import validateEnv from './utils/validateEnv';
import AuthenticationController from './authentication/authentication.controller';
import mongoose from 'mongoose';
import UserController from './user/user.controller';

validateEnv();

const app = new App(
  [
    new PostController(),
    new UserController(),
    new AuthenticationController(),
  ]
);

const main = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}${process.env.MONGO_PATH}`
    );
    console.log('Database connected')
    app.listen();
  } catch (e) {
    console.log('App initialization error');
    console.log(e);
    process.exit(1);
  }
}

main();