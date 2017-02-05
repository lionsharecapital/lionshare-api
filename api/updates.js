import Router     from 'koa-router';
import fetch      from 'isomorphic-fetch';
import semver     from 'semver';
import httpErrors from 'http-errors';

import redis from '../db/redis';
const router = new Router();

router.get('/', async (ctx) => {
  const {
    v,
    os,
  } = ctx.query;

  // Validate params, both v and os are required
  if (!v || !semver.valid(semver.clean(v))) throw httpErrors.BadRequest('Invalid v param, semmver required');
  if (os !== 'darwin') throw httpErrors.BadRequest('Invalid os param');

  try {
    const githubData = await fetch('https://api.github.com/repos/lionsharecapital/lionshare-desktop/releases/latest');
    const data = await githubData.json();
    const build = data.assets[0];

    const version = semver.clean(data.tag_name);
    if (semver.gt(version, v)) {
      // Never version available
      ctx.body = {
        url: build['browser_download_url'],
        name: data.name,
        notes: data.body,
        'pub_date': data.published_at,
      }
      ctx.status = 200;
    } else {
      // Returning 204 as there's no updates just yet
      ctx.status = 204;
    }

  } catch (e) {
    console.log('Github update failed');
    console.log(e);
    ctx.status = 500;
  }
});

export default router;
