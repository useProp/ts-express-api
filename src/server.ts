import 'dotenv/config';
import 'reflect-metadata';
import App from './app';
import PostController from './post/post.controller';
import validateEnv from './utils/validateEnv';

validateEnv();

const app = new App(
  [
    new PostController(),
  ]
);