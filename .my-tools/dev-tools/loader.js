process.env.INPUT_IMAGE_BUCKET = 'serverless-demo.files.rnd.upload'
process.env.OUTPUT_IMAGE_BUCKET = 'serverless-demo.files.rnd.publish'
process.env.AVATAR_IMAGE_FILE = 'avatar.jpg'

const app = require('./../../face-processor/index')

setTimeout(() => {
  app.handler()
}, 30000);

setInterval(() => {

}, 2000);
