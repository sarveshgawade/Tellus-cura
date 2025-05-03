import mongoose, { model } from "mongoose";

const counterSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
      },
    latestEmployeeId:{
        type: Number,
        required : true,
        default: 1000
    }
})

const Counter = model('Counter',counterSchema)

export default Counter