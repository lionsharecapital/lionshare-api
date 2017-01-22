import Koa from 'koa';
import compress from 'koa-compress';
import logger from 'koa-logger';
import mount from 'koa-mount';
import cors from './middlewares/cors';

import api from './api';

const app = new Koa();

app.use(compress());
app.use(cors());
app.use(mount('/api', api));

if (process.env.NODE_ENV === 'development') {
  app.use(logger());
}

export default app;
