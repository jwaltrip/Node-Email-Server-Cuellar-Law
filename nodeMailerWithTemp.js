const nodeMailer = require("nodemailer");
const Email = require('email-templates');
const moment = require("moment");

const getCurrentDate = () => {
  return moment().format("MMM D, YYYY @ LT");
};

exports.sendPasswordReset = function (toEmail, name, subject, message) {
  
  const email = new Email();
  const locals = {
    name: name,
    date: getCurrentDate(),
    subject: subject,
    message: message,
    email: toEmail
  };
  
  Promise
    .all([
      email.render('test/html', locals),
      email.render('test/subject', locals)
    ])
    .then(([ html, subject ]) => {
      console.log('html: ', html);
      console.log('subject: ', subject);
  
      let transporter = nodeMailer.createTransport({
        host: 'smtp.googlemail.com', // Gmail Host
        port: 465, // Port
        secure: true, // this is true as port is 465
        auth: {
          user: 'contactpage.cuellarlaw', //Gmail username
          pass: process.env.CUELLAR_CONTACT_EMAIL_PASS // Gmail password
        }
      });
  
      let mailOptions = {
        from: `"Cuellar Law - TEST MAIL" <contactpage.cuellarlaw@gmail.com>`,
        to: toEmail, // Recepient email address. Multiple emails can send separated by commas
        subject: subject,
        html: html,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
      });
    })
    .catch(console.error);
};