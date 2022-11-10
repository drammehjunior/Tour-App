const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PASSWORD,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    //active in gmail 'less secure app' option
  });

  //2) define the email options
  const mailOptions = {
    from: 'Mamed Drammeh <admin@mamedsupport.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //3) send the email with nodemailer
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
