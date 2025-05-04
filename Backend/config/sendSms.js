import twilio from 'twilio'
import { configDotenv } from 'dotenv';
configDotenv()

const client = new twilio(process.env.TWILIO_SID,process.env.TWILIO_AUTH_TOKEN)

const sendSms = async (phoneNumber)=> {
    try {
        
        const response = await client.messages.create({
            from : process.env.TWILIO_PHONE_NUMBER2,
            to: phoneNumber,
            body: `Hi welcome to tellusCura LTD`
        })

        console.log(response);
        
        if(response){
            console.log(`SMS sent successfully !`);
            

        }
        
        
    } catch (error) {
        console.log(error);

        // return res.status(500).json({
        //     success: false ,
        //     message: error.message
        // })
        
    }
}



export {sendSms}