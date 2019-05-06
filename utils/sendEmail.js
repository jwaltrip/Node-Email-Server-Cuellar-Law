const nodeMailer = require("nodemailer");
const Email = require('email-templates');
const moment = require("moment");

// returns current date in the format "May 5, 2019 @ 8:40pm"
const getCurrentDate = () => {
  return moment().format("MMM D, YYYY @ LT");
};

// function to send email
exports.sendEmail = function (recipient, name, subject, message) {
  return new Promise((resolve, reject) => {
    const email = new Email();
    const locals = {
      name: name,
      date: getCurrentDate(),
      subject: subject,
      message: message,
      email: recipient
    };
  
    Promise
      .all([
        email.render('ContactForm/html', locals),
        email.render('ContactForm/subject', locals)
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
          to: recipient, // Recepient email address. Multiple emails can send separated by commas
          subject: subject,
          html: html,
          // text: text
        };
      
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            // create object to return containing email information
            const emailInfo = {
              email: {
                from: mailOptions.from,
                to: mailOptions.to,
                subject: mailOptions.subject,
                html: html,
                // text: text,
                info: info
              },
              errors: error
            };
            
            // fulfill the promise - essentially a return statement
            resolve(emailInfo);
          }
          // else, no error. msg sent successfully
          console.log('Message sent: %s', info.messageId);
          // create object to return containing email information
          const emailInfo = {
            email: {
              from: mailOptions.from,
              to: mailOptions.to,
              subject: mailOptions.subject,
              html: html,
              // text: text,
              messageId: info.messageId,
              info: info
            },
            errors: null
          };
        
          resolve(emailInfo);
        });
      })
      .catch(console.error);
  });
};