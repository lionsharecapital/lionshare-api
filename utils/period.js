const VALID_PERIODS = ["day", "week", "month"];

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const convertPeriod = (period, exchange) => {
  period = period || "day";

  if (!VALID_PERIODS.includes(period)) {
    period = "day";
  }

  const end = new Date();
  let start = new Date();
  let granularity = 3600; // 1 hour

  switch (period) {
    case "day":
      start.setUTCDate(end.getUTCDate() - 1);
      granularity = 3600; // 1 hour
      break;
    case "week":
      start.setUTCDate(end.getUTCDate() - 7);
      granularity = 21600; // 6 hours
      break;
    case "month":
      start.setUTCMonth(end.getUTCMonth() - 1);
      granularity = 86400; // 1 day
      break;
    default:
      start.setUTCDate(end.getUTCDate() - 1);
  }

  // special cases for poloniex
  if (period === "week" && exchange === "poloniex") {
    granularity = 14400;
  }

  return { start, end, granularity };
};

export { convertPeriod, sleep, VALID_PERIODS };
