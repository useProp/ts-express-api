import 'dotenv/config';
import 'reflect-metadata';
import App from './app';
import validateEnv from './utils/validateEnv';
import PostController from './posts/post.controller';
import { AddressController } from './addresses/address.controller';
import { AuthController } from './auth/auth.controller';
import { CategoryController } from './categories/category.controller';

validateEnv();

const main = async () => {
  try {
    const app = new App(
      [
        new PostController(),
        new AddressController(),
        new AuthController(),
        new CategoryController(),
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