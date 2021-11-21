var nodemailer = require('nodemailer');

module.exports.SendEmail= (email_to_send,subject,content)=>{
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD_EMAIL
        }
      });
      
    var mailOptions = {
        from: process.env.EMAIL,
        to: email_to_send,
        subject: subject,
        html: content
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}