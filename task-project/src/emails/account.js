const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) =>{
  sgMail.send({
    to: email,
    from: process.env.APP_EMAIL,
    subject: 'Thanks for join in!',
    text: `welcome to the app, ${name}.`
  });
}

const sendCancelationEmail = (email, name) =>{
  sgMail.send({
    to: email,
    from: process.env.APP_EMAIL,
    subject:'Sorry to see you go!',
    text:`Goodbye,${name}, I hope to see you back sometime soon!`
  });
}

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail
}