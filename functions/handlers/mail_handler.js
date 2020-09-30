'use strict';

const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

class Mail {
    constructor() {
        const gmailEmail = functions.config().gmail.email;
        const gmailPassword = functions.config().gmail.password;

        this.mailTransport = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: gmailEmail,
            pass: gmailPassword,
          },
        });
    }

    async sendMail(mailOptions) {
        try {
            await this.mailTransport.sendMail(mailOptions);
            console.log('New segment confirmation email sent to:', mailOptions.to);
          } catch(error) {
            console.error('There was an error while sending the email:', error);
          }
    }
}

module.exports = Mail;