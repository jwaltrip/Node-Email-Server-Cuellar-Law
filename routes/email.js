const express = require('express');
const router = express.Router();
const mail = require("../utils/sendEmail");

/* GET home page. */
router.post('/email/send', (req, res, next) => {
  const { email, name, subject, message } = req.body;
  
  mail.sendEmail(email, name, subject, message)
    .then(result => {
      // log the result of sending the email and email details
      console.log(result);
      // return the email info as json
      return res.json({ result });
    })
    .catch(console.error);
});

module.exports = router;
