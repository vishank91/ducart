const nodeMailer = require("nodemailer")

const mailer = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    tls: true,
    // ssl:true,//in case of hosting
    auth: {
        user: process.env.MAIL_SENDER,
        pass: process.env.MAIL_PASSWORD
    }
})

module.exports = mailer