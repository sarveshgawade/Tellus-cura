import nodemailer from 'nodemailer';
import { configDotenv } from 'dotenv';
configDotenv()

const transporter = nodemailer.createTransport({
    secure: true ,
    host: 'smtp.gmail.com',
    port: 465,
    auth:{
        user:  process.env.GMAIL_ACCOUNT,
        pass: process.env.GMAIL_APP_PASSWORD
    }
})

function sendMail(to,sub,msg){

    console.log(transporter);
    console.log();
    
    const res = transporter.sendMail({
        from: `"Tellus Cura" <${process.env.GMAIL_ACCOUNT}>`,
        to: to,
        subject: sub ,
        html: msg
    })
    console.log('email sent');

    console.log(res);
    
    
}


export default sendMail