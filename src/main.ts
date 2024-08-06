import App from './app';
import PostsController from './posts/posts.controller';

const app = new App(
  [new PostsController()],
  5000,
);

const main = async () => {
  try {
    app.listen();
  } catch (e) {
    console.log(e);
    process.exit(1)
  }
}

main();