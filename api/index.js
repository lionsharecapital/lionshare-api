import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import httpErrors from 'http-errors';

import prices from './prices';
import markets from './markets';

const api = new Koa();
const router = new Router();

router.use('/prices', prices.routes());
router.use('/markets', markets.routes());
api.use(router.routes());

router.get('/updates', (ctx) => {
  // Returning 204 as there's no updates just yet
  ctx.status = 204;
});

api.use(bodyParser());

// API 404 handler
api.use(async () => {
  throw httpErrors.NotFound();
});

export default api;
