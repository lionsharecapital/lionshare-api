const VALID_PERIODS = [
  'hour',
  'day',
  'week',
  'month',
  'year'
];

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const convertPeriod = (period, exchange) => {
  period = period || 'day';

  if (!VALID_PERIODS.includes(period)) {
    period = 'day';
  }

  const end = new Date();
  let start = new Date();

  switch (period) {
    case 'hour':
      start.setUTCHours(end.getUTCHours() - 1);
      break;
    case 'day':
      start.setUTCDate(end.getUTCDate() - 1);
      break;
    case 'week':
      start.setUTCDate(end.getUTCDate() - 7);
      break;
    case 'month':
      start.setUTCMonth(end.getUTCMonth() - 1);
      break;
    case 'year':
      start.setUTCFullYear(end.getUTCFullYear() - 1);
      break;
    default:
      start.setUTCDate(end.getUTCDate() - 1);
  }


  const diff = (end.getTime() - start.getTime()) / 1000;
  let granularity = diff / 12;

  // special cases for poloniex
  if (period === 'week') {
    granularity = 14400;
  } else if (period === 'month' || period === 'year') {
    granularity = 86400;
  }

  return { start, end, granularity };
};

export { convertPeriod, sleep, VALID_PERIODS };
