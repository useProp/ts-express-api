import 'dotenv/config';
import 'reflect-metadata';
import App from './app';
import PostController from './post/post.controller';
import validateEnv from './utils/validateEnv';
import AddressController from './address/address.controller';
import AuthenticationController from './authentication/authentication.controller';
import CategoryController from './category/category.controller';

validateEnv();

const app = new App(
  [
    new PostController(),
    new AddressController(),
    new AuthenticationController(),
    new CategoryController(),
  ]
);