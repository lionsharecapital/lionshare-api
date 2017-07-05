import Exchange from "../exchange/Exchange";
import { sleep, VALID_PERIODS } from "../utils/period";

const DEFAULT_PERIOD = 60 * 1000;

class UpdateJob {
  constructor(options = {}) {
    this.period = options.period;
    this.jobRunPeriod = options.jobRunPeriod || DEFAULT_PERIOD;
    this.exchange = new Exchange();
  }

  start = () => {
    this.interval = setInterval(async () => {
      try {
        await this.exchange.updateAllCache(this.period);
      } catch (e) {
        console.log(`[${this.period}] Update job failed`);
        console.log(e);
      }
    }, this.jobRunPeriod);
  };

  stop = () => {
    if (this.interval) {
      clearInterval(this.interval);
    }
  };
}

const startCacheUpdateJobs = async () => {
  let updateJob;
  for (let period of VALID_PERIODS) {
    updateJob = new UpdateJob({
      period,
      jobRunPeriod: 60 * 1000
    });
    updateJob.start();
    await sleep(5000);
  }
};

export { startCacheUpdateJobs };
export default UpdateJob;
