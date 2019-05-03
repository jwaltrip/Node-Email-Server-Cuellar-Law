/**
 * Created by olyjosh on 29/06/2017.
 */

// const sender = 'smtps://jake.waltrip.dev%40gmail.com';   // The emailto use in sending the email(Change the @ symbol to %40 or do a url encoding )
// const password = 'j4kew4ltrip';  // password of the email to use

const nodeMailer = require("nodemailer");
const Email = require('email-templates');


// const transporter = nodeMailer.createTransport(sender + ':' + password + '@smtp.gmail.com');
//
// const email = new Email({
//   message: {
//     from: 'contactpage.cuellarlaw@gmail.com'
//   },
//   // uncomment below to send emails in development/test env:
//   send: true,
//   transport: {
//     jsonTransport: true
//   }
// });

const formatDate = (date) => {
  const monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "July",
    "Aug", "Sep", "Oct",
    "Nov", "Dec"
  ];
  
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();
  
  return monthNames[monthIndex] + ' ' + day + ', ' + year;
};

exports.sendPasswordReset = function (toEmail, name, subject, message) {
  
  const email = new Email();
  const locals = {
    name: name,
    date: formatDate(new Date()),
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
      console.log('html', html);
      console.log('text', subject);
  
      let transporter = nodeMailer.createTransport({
        host: 'smtp.googlemail.com', // Gmail Host
        port: 465, // Port
        secure: true, // this is true as port is 465
        auth: {
          user: 'contactpage.cuellarlaw', //Gmail username
          pass: 'Dragonball33' // Gmail password
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