import 'dotenv/config';
import 'reflect-metadata';
import App from './app';
import validateEnv from './utils/validateEnv';
import PostController from './posts/post.controller';

validateEnv();

const main = async () => {
  try {
    const app = new App(
      [
        new PostController(),
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