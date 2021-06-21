import express from 'express';
import { resolve } from 'path';
import routes from './routes';
import cors from 'cors';

require('./database/index');

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(cors());
    this.server.use(
      '/files',
      express.static(resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }
  routes() {
    this.server.use('/api', routes);
  }
}

export default new App().server;
