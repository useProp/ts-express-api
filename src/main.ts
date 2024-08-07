import 'dotenv/config';
import App from './app';
import PostsController from './posts/posts.controller';
import validateEnv from './utils/validateEnv';

validateEnv();

const main = async () => {
  try {
    const app = new App(
      [new PostsController()],
      Number(process.env.PORT) || 5000,
    );
    app.listen();
  } catch (e) {
    console.log(e);
    process.exit(1)
  }
}

main();