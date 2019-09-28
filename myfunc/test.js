process.env.DB_HOST = 'localhost';
process.env.DB_DATABASE = 'demo';
process.env.DB_USER = 'demo';
process.env.DB_PASSWORD = 'demo123';
process.env.MEDIA_BUCKET = 'files.rnd';
process.env.MEDIA_TTL = 15;
process.env.TZ = '+07:00';//'Europe/Paris';

const main = require('./index');

main.handler({}, {}).then(() => {
  console.log('DONE');
  process.exit(0);
}).catch((err) => {
  console.log(err);
  process.exit(0);
});

setInterval(() => {}, 2000);
