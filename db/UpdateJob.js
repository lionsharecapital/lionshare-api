import Exchange from '../exchange/Exchange';

const DEFAULT_PERIOD = 60 * 1000;

class UpdateJob {
  constructor(options = {}) {
    this.period = options.period || DEFAULT_PERIOD;
    this.exchange = new Exchange();
  }
  start = async () => {
    this.interval = setInterval(async () => {
      try {
        console.log('Update job is running: ' + new Date());
        await this.exchange.updateAllCache();
        console.log('Update job is done');
      } catch (e) {
        console.log('Update job failed');
        console.log(e);
      }
    }, this.period);
  }

  stop = () => {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}

export default UpdateJob;
