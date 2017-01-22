# api.lionshare.capital

API that powers [Lionshare](https://lionshare.capital) by providing both historical (REST)
and realtime time (websocket) cryptocurrency market data.

Build with Node, Koa 2, `uws` and Redis.

## Development

Redis is required for caching and a valid connection URL should be set to `REDIS_URL`
environment variable before running the development server. `.env` is loaded on startup.

```
yarn
yarn run dev
```

## License

MIT
