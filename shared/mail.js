const mandrill = require('mandrill-api/mandrill');
const {generateHashToken} = require('./tools');

const {
  UNSUBSCRIBE_LINK = '',
  COMMON_SECRET = 'xxxxx',
  MANDRILL_SECRET_KEY = 'xxxxx',
} = process.env;

class Mail {
  constructor() {
    this.mandrillClient = new mandrill.Mandrill(MANDRILL_SECRET_KEY);
  }

  async mandrill(templateName, message) {
    const success = { success: true };

    message.from_email = 'notification@tuanquynet.click';
    message.from_name = 'Demo';
    message.important = false;
    message.merge = true;
    message.merge_language = 'handlebars';

    return new Promise((resolve, reject ) => {
      if (message.to.length > 0) {
        this.mandrillClient.messages.sendTemplate({
          template_name: templateName,
          template_content: [],
          message,
        }, (result) => {
          console.log('Mail.mandrill() done');
          /* eslint-disable no-restricted-syntax, yoda, no-unused-vars */
          let rejected = 0;

          for (const key in result) {
            if (result[key].status === 'rejected') {
              rejected++;
            }
          }

          console.log('rejected count', rejected);
          resolve(success);
        }, (err) => {
          console.log('err', err);
          reject(err);
        });
      } else {
        console.log('SEND set to false.');
        resolve(success);
      }
    });
  }

  async getHourlyQuota() {
    return new Promise((resolve, reject) => {
      this.mandrillClient.users.info({}, (result) => {
        resolve(result && result.hourly_quota || 0);
      }, (error) => {
        reject(error);
      });
    });
  }
}

module.exports = Mail;
