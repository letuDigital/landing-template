const { join } = require('path');
const nconf = require('nconf');
require('dotenv').config({ path: join(__dirname, '../.env') });
nconf.argv().env().file(join(__dirname, 'config.json'));

const appConfig = {
  IS_FULL_WIDTH: !!nconf.get('IS_FULL_WIDTH'),
  LANDING_NAME: nconf.get('LANDING_NAME'),
};

module.exports = appConfig;
