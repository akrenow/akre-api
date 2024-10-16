const nodemailer = require("nodemailer");

 const sender = {
  email: process.env.EMAIL_USER,
  name: "Akre.india",
};

const sendEmail = async (from, to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", 
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from,
    to,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendEmail,sender };
