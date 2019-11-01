const sgMail = require('@sendgrid/mail');
const sendgridAPIKey = require('../../config/keys').sendGridApiKey;
const appEmail = require('../../config/keys').appEmail;

sgMail.setApiKey(sendgridAPIKey);

const sendWelcomeEmail = (email, name) =>{
  sgMail.send({
    to: email,
    from: appEmail,
    subject: 'Thanks for join in!',
    text: `welcome to the app, ${name}.`
  });
}

const sendCancelationEmail = (email, name) =>{
  sgMail.send({
    to: email,
    from: appEmail,
    subject:'Sorry to see you go!',
    text:`Goodbye,${name}, I hope to see you back sometime soon!`
  });
}

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail
}