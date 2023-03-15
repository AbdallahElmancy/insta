"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
let sendEmail = async function(email,massage,pathAttachmentPdf) {
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service:"gmail",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAILSEND, // generated ethereal user
        pass: process.env.PASSWORD, // generated ethereal password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Fred Foo 👻" <process.env.EMAILSEND>', // sender address
      to: email, // list of receivers
      subject: "Hello ✔", // Subject line
      attachments:[pathAttachmentPdf],
      text: "Hello world?", // plain text body
      html: massage, // html body
    });
}

module.exports = sendEmail
