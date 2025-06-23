import express from 'express';
import * as bodyParser from "body-parser";

import recipeController from './controller/recipe-controller';

declare const module: any;

function main() {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(bodyParser.json());

  app.get('/', (_req, res) => {
    res.send('Hello, World3332!');
  });

  app.use('/recipes', recipeController);

  const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => server.close());
  }
}

main()
