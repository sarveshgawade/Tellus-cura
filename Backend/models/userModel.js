    import mongoose, { model } from "mongoose";
    import brcypt from 'bcrypt'
    import jwt from 'jsonwebtoken'
    import Counter from './counterModel.js'

    const userSchema = new mongoose.Schema({
        userName: {
            type : String ,
            trim : true,
            required: [true,`Username is a required field`] 
        },
        email:{
            type:'String',
            required: [true,`Email is a required field`] ,
            trim: true ,
            unique: true ,
            match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'Please fill in a valid email address'
            ] 

        },
        password:{
            type:'String',
            required: [true,`Password is a required field`] ,
            trim: true ,
            select : false   ,
            match : [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,`Enter a strong password.It must contain at least eight characters, at least one number and both lower and uppercase letters and special characters`]  

        },
        role:{
            type:'String',
            enum: ['USER','ADMIN'],
            default: 'USER',
            required: [true,`Role is a required field`] 
        },
        previousShift:{
            type: String ,
            enum: ['MORNING','EVENING','NIGHT'],
            default: 'MORNING'
        },
        currentShift:{
            type: String ,
            enum: ['MORNING','EVENING','NIGHT'],
            default: 'MORNING'
        },
        phoneNumber:{
            type: 'String',
            required: [true,'Phone number is a required field ']
        },
        employeeId :{
            type: Number,
        }
    })

    userSchema.pre('save', async function(next) {

        if(this.isNew){
            const counter = await Counter.findOneAndUpdate(
                {_id: 'employeeId'},
                {$inc: {latestEmployeeId: 1}},
                {new: true, upsert: true,$setOnInsert: { latestEmployeeId: 1000 } }
            )

            this.employeeId = counter.latestEmployeeId
        }

        if(!this.isModified('password')){
            return next
        }
        this.password = await brcypt.hash(this.password,7)
    }
    )

    userSchema.methods = {
        generateJwtToken : async function () {
            return await jwt.sign({
                id: this._id,
                employeeId: this.employeeId,
                role: this.role,
                userName: this.userName,
                email: this.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRY
            }
            )
        },
        comparePassword: async function (plainTextPassword) {
            return await brcypt.compare(plainTextPassword,this.password)
        }
    }

    const User = model('User',userSchema)

    export default User