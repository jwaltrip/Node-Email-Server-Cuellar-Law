const nodeMailer = require("nodemailer");
const Email = require('email-templates');
const moment = require("moment");

// function to send email
exports.sendEmail = function (recipient, name, subject, message) {
  return new Promise((resolve, reject) => {
    const email = new Email();
    const locals = {
      name: name,
      date: moment().format("MMM D, YYYY @ LT"), // formats the current date like "May 5, 2019 @ 9:30pm"
      subject: subject,
      message: message,
      email: recipient
    };
  
    Promise
      .all([
        email.render('ContactForm/html', locals),
        email.render('ContactForm/subject', locals),
        email.render('ContactForm/text', locals),
      ])
      .then(([ html, subject, text ]) => {
        console.log('html: ', html);
        console.log('subject: ', subject);
        console.log('text: ', text);
      
        let transporter = nodeMailer.createTransport({
          host: 'smtp.googlemail.com', // Gmail Host
          port: 465, // Port
          secure: true, // this is true as port is 465
          auth: {
            user: process.env.CUELLAR_CONTACT_EMAIL_USER, //Gmail username
            pass: process.env.CUELLAR_CONTACT_EMAIL_PASS // Gmail password
          }
        });
        
        // if the TEST_EMAIL env var is set to true, add "TEST MAIL" to the subject
        const fromEmail = (process.env.TEST_EMAIL) ?
                          `"Cuellar Law - TEST MAIL" <${process.env.CUELLAR_EMAIL}>` :
                          `"Cuellar Law" <${process.env.CUELLAR_EMAIL}>`;
      
        let mailOptions = {
          from: fromEmail,
          to: recipient, // Recepient email address. Multiple emails can send separated by commas
          replyTo: recipient,
          subject: subject,
          html: html,
          text: text
        };
      
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            // create object to return containing email information
            const emailInfo = {
              from: mailOptions.from,
              to: mailOptions.to,
              subject: mailOptions.subject,
              html: html,
              text: text,
              info: info,
              errors: error
            };
            
            // fulfill the promise - essentially a return statement
            // there was an error sending the email
            resolve(emailInfo);
          }
          // else, no error. msg sent successfully
          console.log('Message sent: %s', info.messageId);
          // create object to return containing email information
          const emailInfo = {
            from: mailOptions.from,
            to: mailOptions.to,
            subject: mailOptions.subject,
            html: html,
            text: text,
            info: info,
            errors: null
          };
          
          // fulfill the promise upon successful send of email
          resolve(emailInfo);
        });
      })
      .catch(console.error);
  });
};