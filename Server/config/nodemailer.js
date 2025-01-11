import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({

    // smtp account
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    }

})

export default transporter;