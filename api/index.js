import Koa from "koa";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import httpErrors from "http-errors";

import assets from "./assets";
import prices from "./prices";
import markets from "./markets";
import updates from "./updates";

const api = new Koa();
const router = new Router();

router.use("/assets", assets.routes());
router.use("/prices", prices.routes());
router.use("/markets", markets.routes());
router.use("/updates", updates.routes());
api.use(router.routes());
api.use(bodyParser());

// API 404 handler
api.use(async () => {
  throw httpErrors.NotFound();
});

export default api;
