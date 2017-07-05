import ApiClient from "./ApiClient";

const BASE_URL = "https://api.coinmarketcap.com/v1/";

class CoinmarketCap {
  constructor() {
    this.apiClient = new ApiClient({ baseUrl: BASE_URL });
  }

  getMarketData = async () => {
    const data = await this.apiClient.get("ticker");
    return data;
  };
}

export default CoinmarketCap;
