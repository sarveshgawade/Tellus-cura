import sendMail from "../config/sendMail.js";
import { sendSms } from "../config/sendSms.js";
import User from "../models/userModel.js";

const cookieOptions = {
    maxAge: 1*24*60*60*1000, 
    httpOnly: true,
    secure: false
}

const register = async(req , res) => {
    try {
        const {
            userName,email,password,role,phoneNumber
        } = req.body

    if(!userName || !email || !password || !phoneNumber ){
       return res.status(500).json('All fields are required !') 
    }

    const userExists = await User.findOne({email})

    if(userExists){
        return res.status(500).json('User already exists !') 
    }

    const newUser = await User.create({
        userName,email,password,role,phoneNumber
    })

    if(!newUser){
        return res.status(500).json('User registration failed !')
    }

    // save user in DB
    await newUser.save()

    //Register SuccessFully Mail
  

    // token generation
    const token = await newUser.generateJwtToken()

    // put token into cookie
    res.cookie('token',token,cookieOptions) 

    newUser.password = undefined

    res.status(200).json({
        success: true ,
        message: `User registered successfully`, 
        newUser
    })
        
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false ,
            message: error.message
        })
        
    }
}

const login = async (req,res) =>{

    try {
        const {employeeId,password} = req.body

        if(!employeeId || !password){
            return res.status(500).json('All fields are required !') 
        }

        // getting password explicitly because it was selected as false in schema
        const existingUser = await User.findOne({
            employeeId
        }).select('+password')  

        if(!existingUser || !(await existingUser.comparePassword(password))){
            return res.status(500).json('EmployeeID & password wont match !') 
        }

        const token = await existingUser.generateJwtToken()
        res.cookie('token',token,cookieOptions)

        // console.log(token);
        

        existingUser.password = undefined

        // sending SMS for testing purpose
        //sendSms('+917559375893')
//         await sendMail('bhaktigote0303@gmail.com','Reminder for documents upload',`Dear [Name],

// This is a kind reminder to upload the required document at your earliest convenience. If you’ve already submitted it, kindly disregard this message.

// Please let us know if you face any issues or need assistance.

// Best regards,
// Tellus Cura
// `)
        
        res.status(200).json({
            success: true,
            message: `User logged in successfully`,
            existingUser
        })
    } catch (e) {

        console.log(e);
        

        return res.status(500).json({
            success: false ,
            message: e.message
        })
    }
    

}

const getProfile = async (req,res,next) => {
    try {
        // console.log(req.user);
        
        const userID = req.user.id

        const userProfile = await User.findById(userID)

        if(!userProfile) {
            return res.status(500).json('User not found !')
        }


        res.status(200).json({
            success: true ,
            message: 'User details found !',
            userProfile
        })

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false ,
            message: error.message
        })
    }
}

const logout = async (req,res) => {
    try {
        res.cookie('token',null,{
            secure: true ,
            maxAge: 0 ,
            httpOnly: true
        })

        res.status(200).json({
            success: true ,
            message: 'User logged out'
        })
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false ,
            message: error.message
        })
    }
}

const changePassword = async (req,res) => {
    try {
        const {oldPassword, newPassword} = req.body
        const userID = req.user.id

        if(!oldPassword || !newPassword){return res.status(500).json('All fields are required')}

        if(oldPassword == newPassword) {return res.status(500).json('Old and New password are same')}

        const user = await User.findById(userID).select('+password')

        if(!user) {return res.status(500).json('User not found')}

        const isPasswordCorrect = await user.comparePassword(oldPassword)

        if(!isPasswordCorrect){return res.status(500).json('Old  password is invalid')}

        user.password = newPassword

        await user.save()

        user.password = undefined

        res.status(200).json({
            success: true ,
            message: 'Password changed',
        })
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false ,
            message: error.message
        })
    }
}

export {register,login,getProfile,logout,changePassword}