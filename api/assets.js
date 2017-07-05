import Router from "koa-router";
import fetch from "isomorphic-fetch";

import assets from "../utils/assets";
import Exchange from "../exchange/Exchange";
import redis from "../db/redis";

const router = new Router();
const exchange = new Exchange();

router.get("/", async ctx => {
  try {
    const redisMarketData = await redis.getAsync("api-markets");
    let markets = JSON.parse(redisMarketData);

    if (!markets) {
      markets = await exchange.getMarketData();
      await redis.setAsync("api-markets", JSON.stringify(markets));
    }

    const period = ctx.query.period || "day";
    const key = `api-prices-${period}`;
    const redisPricesData = await redis.getAsync(key);
    let prices = JSON.parse(redisPricesData);

    if (!prices) {
      prices = await exchange.getPrices(period);
      await redis.setAsync(key, JSON.stringify(prices));
    }

    const assetData = {};
    for (let asset of assets) {
      assetData[asset.symbol] = {
        ...asset,
        ...markets[asset.symbol],
        price: prices[asset.symbol]
      };
    }

    ctx.body = { data: assetData };
  } catch (e) {
    console.log("Assets data API failed");
    console.log(e);
  }
});

export default router;
