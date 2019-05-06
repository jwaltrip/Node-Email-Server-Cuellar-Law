require('dotenv').config();
const express = require('express');
// const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();

// send email route
const emailRoute = require("./routes/email");

//Sending email here
// const mail = require('./nodeMailerWithTemp');

/**
* Don't forget to change your receipient details here
* I need to modeify this as most people who followed this tutorial always end up sending mail to me instead
*/
// const receiver = 'zgutier5@gmail.com';
// const receiver = 'jake.waltrip.dev@gmail.com';
// const subject = 'TEST - Test email msg';
// const name = 'Jake Test 2';
// const message = 'This is the message body text. Test help me plzzzz.\n\nSent manually from backend';
// // const password = 'http://yourdomain.com/some-password-links';
// mail.sendPasswordReset(receiver, name, subject, message);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// setup routes
app.use("/api", emailRoute);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
