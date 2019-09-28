/* © 2018
 * @author Quy Tran
 *
 * Static configs, can be overwritten by env variables
 */

import {} from 'dotenv/config';

const config = {
  NODE_ENV: 'development',
  AWS_REGION: 'eu-central-1',
  PORT: 1221,
  DB_HOST: '',
  DB_DATABASE: 'demo',
  DB_PORT: 3306,
  DB_USER: 'xxxx',
  DB_PASSWORD: 'xxxxx',
  TZ: 'Europe/Paris',

  AWS_LAMBDA_KEY: 'xxxxx',
  AWS_LAMBDA_SECRET: 'xxxxx',
};

// overwrite config value from ENV variable
// const env = process.env;
/* eslint-disable guard-for-in, no-restricted-syntax */
for (const name in config) {
  let value = process.env[name];
  switch (value) {
    case undefined:
      break;
    case 'false':
      config[name] = false;
      break;
    case 'null':
      config[name] = null;
      break;
    default:
      if ('string' === typeof value) {
        value = value.replace(/\\n/g, '\n');
      }

      config[name] = value;
      break;
  }
}
/* eslint-enable guard-for-in, no-restricted-syntax */

export default config;
