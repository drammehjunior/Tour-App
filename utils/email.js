const pug = require('pug');
const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');

//new Email(user, url).sendWelcome();

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Mamed Drammeh <${process.env.EMAIL_FROM}>`;
  }

  createTransport() {
    if (process.env.NODE_ENV === 'production') {
      //USE SENDGRID
      return 1;
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  send(template, subject) {
    // 1) Render the HTML based on a pub template
    const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject:
    });

    //2) Define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };

    // 3) Create a transport and send email
  }

  sendWelcome(){
    this.send('welcome', 'Welcome to the Natours Family');

  }
};

// const sendEmail = async (options) => {
//
//   //2) define the email options
//   const mailOptions = {
//     from: 'Mamed Drammeh <admin@mamedsupport.com>',
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//   };
//
//   //3) send the email with nodemailer
//   await transporter.sendMail(mailOptions);
// };