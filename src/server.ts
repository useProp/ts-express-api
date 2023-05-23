import 'dotenv/config';
import 'reflect-metadata';
import App from './app';
import PostController from './post/post.controller';
import validateEnv from './utils/validateEnv';
import AddressController from './address/address.controller';
import AuthenticationController from './authentication/authentication.controller';
import CategoryController from './category/category.controller';
import PgDataSource from './pg-data-source';

validateEnv();

const main = async () => {
  try {
    await PgDataSource.initialize();
    console.log('Database connected');
  } catch (e) {
    console.log('Server running error: ', e);
    process.exit(1);
  }
  const app = new App(
    [
      new PostController(),
      new AddressController(),
      new AuthenticationController(),
      new CategoryController(),
    ]
  );
  app.listen();
}

main();