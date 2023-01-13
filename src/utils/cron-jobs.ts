import moment from 'moment';
import { loadAllDataManager, loadLatestDataManager } from '../controllers/data';
import { loadLatestLocationsManager } from '../controllers/location';

const cron = require('node-cron');

// Load latest locations
cron.schedule('* 5,11,17,23 * * *', async () => {
  try {
    console.log(`[${moment().format('YYYY-MM-DD HH:mm')}] CronJob: Load latest locations running`);
    const result = await loadLatestLocationsManager();
    if (!result) {
      throw 404;
    }
    else {
      console.log(`[${moment().format('YYYY-MM-DD HH:mm')}] CronJob: Load latest locations success`);
    }
  }
  catch (err) {
    console.log(`[${moment().format('YYYY-MM-DD HH:mm')}] CronJob: Load latest locations failed: ${err}`);
  }
});

// Load latest data
cron.schedule('* 5,11,17,23 * * *', async () => {
  try {
    console.log(`[${moment().format('YYYY-MM-DD HH:mm')}] CronJob: Load latest data running`);
    const result = await loadLatestDataManager();
    if (!result) {
      throw 404;
    }
    else {
      console.log(`[${moment().format('YYYY-MM-DD HH:mm')}] CronJob: Load latest data success`);
    }
  }
  catch (err) {
    console.log(`[${moment().format('YYYY-MM-DD HH:mm')}] CronJob: Load latest data failed: ${err}`);
  }
});

// Load all data
cron.schedule('* 5,11,17,23 * * *', async () => {
  try {
    console.log(`[${moment().format('YYYY-MM-DD HH:mm')}] CronJob: Load all data running`);
    const result = await loadAllDataManager();
    if (!result) {
      throw 404;
    }
    else {
      console.log(`[${moment().format('YYYY-MM-DD HH:mm')}] CronJob: Load all data success`);
    }
  }
  catch (err) {
    console.log(`[${moment().format('YYYY-MM-DD HH:mm')}] CronJob: Load all data failed: ${err}`);
  }
});
