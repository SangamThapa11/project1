const nodemailer = require('nodemailer');
const { SMTPConfig } = require('../config/config');

class EmailService {
    #transport; 

    constructor () {
        try {
            this.#transport = nodemailer.createTransport({
                host: SMTPConfig.host, 
                port: SMTPConfig.port, 
                service: SMTPConfig.provider,
                auth: {
                    user: SMTPConfig.user,
                    pass: SMTPConfig.password
                }
            })
        }catch(exception) {
            console.error("***********Error connecting SMTP Server**********");
            console.error(exception)
            throw {
                code: 500, 
                message: "Error connecting SMTP Server",
                status: "SMTP_CONNECTION_ERR"
            }
        }
    }
    async emailSend ({to, subject, message, attachements=null}) {
        try{
            const msgBody = {
                to: to,
                from: SMTPConfig.from,
                subject: subject,
                html: message 
            };
            if(attachements){
               msgBody['attachements'] = attachements 
            }
            const response = await this.#transport.sendMail(msgBody)
            return response 
        }catch(exception) {
            console.error("*********** Error sending email**********");
            console.error(exception);
           throw {
                code: 500, 
                message: "Error Sending Email",
                status: "SMTP_SEND_EMAIL_ERR"
            };
        }
    }

}

module.exports = EmailService;