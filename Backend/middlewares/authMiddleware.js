import jwt from 'jsonwebtoken'
import {configDotenv} from 'dotenv'
configDotenv()

async function isLoggedIn(req,res,next){
    try {
        const {token} = req.cookies
        
        if(!token){
            return res.status(500).json('Unauthenticated user !')
        }

        const userDetails = jwt.verify(token,process.env.JWT_SECRET)

        req.user = userDetails

        next()

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false ,
            message: error.message
        })
    }
}

const  authorizedRoles = (...roles) => async (req,res,next) =>{
    
    const currentRole = req.user.role

    if(!roles.includes(currentRole)){
        return res.status(500).json('You do not have the  access to this route !')
    }

    next()
}

export {isLoggedIn,authorizedRoles}
