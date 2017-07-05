import Router from "koa-router";
import httpErrors from "http-errors";
import fetch from "isomorphic-fetch";

import Exchange from "../exchange/Exchange";
import redis from "../db/redis";

const router = new Router();
const exchange = new Exchange();

router.get("/", async ctx => {
  try {
    const period = ctx.query.period || "day";
    const key = `api-prices-${period}`;
    const redisData = await redis.getAsync(key);
    let prices = JSON.parse(redisData);

    if (!prices) {
      prices = await exchange.getPrices(period);
      await redis.setAsync(key, JSON.stringify(prices));
    }

    ctx.body = { data: prices };
  } catch (e) {
    console.log("Prices data API failed");
    console.log(e);
  }
});

export default router;
