# api.lionshare.capital

API that powers [Lionshare](https://lionshare.capital) by providing both historical (REST)
and realtime time (websocket) cryptocurrency market data. The data is sourced
from [GDAX](https://gdax.com), [Poloniex](https://poloniex.com/), and
[Coinmarketcap](https://coinmarketcap.com/).

Build with Node, Koa 2, `uws` and Redis.

## API Endpoints

### Prices 

`GET https://api.lionshare.capital/api/prices`

#### Params

- `period: hour | day | week | month | year`

Returns historic prices for supported digital currencies

> Example response:

```
{
  "data": {
    "BTC": [924.2, 924.63, 923.82, 923.02, 924.82, ...],
    "ETH": [10.74, 10.8, 10.79, 10.82, 10.82, 10.84, 10.78, ...],
    "LTC": [3.88, 3.86, 3.85, 3.85, 3.86, 3.86, 3.84, ...]
    ...
  }
}
```


### Markets

`GET https://api.lionshare.capital/api/markets`

Returns market capitalization data

> Example response:

```
{
  "data": {
    "BTC": 14718750986, 
    "ETH": 943628626,
    "LTC": 188560718,
    ...
  }
}

```

## Development

Redis is required for caching and a valid connection URL should be set to `REDIS_URL`
environment variable before running the development server. `.env` is loaded on
startup. Make sure that you have `redis` installed and running (`redis-server`)
for local development.

```
yarn
yarn dev
```


[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/lionsharecapital/lionshare-api)

## License

MIT
