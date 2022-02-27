const debug = require('debug')('yagnostic-api: email');
const nodemailer = require('nodemailer');
const config = require('config');

function setMailOptions({ subject, text }) {
  return {
    from: "'Yagnostic-bridge' bridge.alarm@yagnostic.io",
    to: config.email.owner,
    subject,
    text,
  };
}

class EmailsService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      pool: true,
      host: config.email.smtp,
      port: config.email.port,
      secure: true, // use TLS
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });
    this.transporter
      .verify()
      .then(() => debug('SMTP is working...'))
      .catch((error) => {
        debug('Error smtp: %o', error);
        throw error;
      });
  }

  async sendAlarmEmail(params) {
    debug('params = %o', params);
    const mailResPassOptions = setMailOptions({ ...params });
    return this.transporter.sendMail(mailResPassOptions);
  }
}

module.exports = new EmailsService();
