import Koa from "koa";
import ratelimit from "koa-ratelimit";
import compress from "koa-compress";
import logger from "koa-logger";
import mount from "koa-mount";
import cors from "./middlewares/cors";
import redis from "./db/redis";

import api from "./api";

const app = new Koa();

if (process.env.NODE_ENV === "production") {
  app.use(
    ratelimit({
      db: redis,
      duration: 60000,
      errorMessage:
        "Please stop hitting us so hard. Please deploy your own instance of the API",
      id: ctx => ctx.get("X-Real-IP"),
      headers: {
        remaining: "Rate-Limit-Remaining",
        reset: "Rate-Limit-Reset",
        total: "Rate-Limit-Total"
      },
      max: 50
    })
  );
}
app.use(compress());
app.use(cors());
app.use(mount("/api", api));

if (process.env.NODE_ENV === "development") {
  app.use(logger());
}

export default app;
