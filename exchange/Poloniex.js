import autobahn from "autobahn";
import EventEmitter from "events";

import ApiClient from "./ApiClient";
import { convertPeriod } from "../utils/period";

const CRYPTO_CURRENCY_PAIRS = [
  "USDT_REP", // Augur
  "USDT_XMR", // Monero
  "USDT_ZEC", // ZCash
  "USDT_ETC", // Ethereum classic
  "USDT_XRP", // Ripple
  "USDT_DASH", // Dash
  "USDT_STR", // Stellar
  "BTC_LSK", // Lisk
  "BTC_MAID", // MaidSafe
  "BTC_FCT", // Factom
  "BTC_XEM", // NEM
  "ETH_STEEM", // Steem
  "BTC_DOGE", // Dogecoin
  "BTC_BTS", // BitShares
  "BTC_GAME", // GameCredit
  "BTC_ARDR", // Ardor
  "BTC_DCR", // Decred
  "BTC_SJCX", // Storjcoin X
  "BTC_SC", // SiaCoin
  "BTC_GNT" // Golem tokens
  "BTC_BCH" // Bitcoin Cash
];

const BASE_URL = "https://poloniex.com/public";
const WS_URL = "wss://api.poloniex.com";

class Poloniex extends EventEmitter {
  constructor() {
    super();
    this.apiClient = new ApiClient({ baseUrl: BASE_URL });
    // autobahn handles retries
    this.websocket = new autobahn.Connection({
      url: WS_URL,
      realm: "realm1",
      max_retries: -1
    });
  }

  connect = () => {
    this.websocket.onopen = connection => {
      connection.subscribe("ticker", data => {
        if (CRYPTO_CURRENCY_PAIRS.indexOf(data[0]) > -1) {
          const cryptoCurrency = data[0].split("_")[1];
          const price = parseFloat(data[1]);
          this.emit("message", {
            cryptoCurrency,
            price
          });
        }
      });
    };

    this.websocket.open();
  };

  getPrices = async period => {
    let rates = {};

    let { start, end, granularity } = convertPeriod(period, "poloniex");

    start = start.getTime() / 1000;
    end = end.getTime() / 1000;

    for (let pair of CRYPTO_CURRENCY_PAIRS) {
      const cryptoCurrency = pair.split("_")[1];
      const cryptoRates = [];

      const data = await this.apiClient.get("", {
        command: "returnChartData",
        currencyPair: pair,
        start,
        end,
        period: granularity
      });
      for (let rate of data) {
        cryptoRates.push(parseFloat(rate["close"]));
      }
      rates[cryptoCurrency] = cryptoRates;
    }

    return rates;
  };
}

export default Poloniex;
