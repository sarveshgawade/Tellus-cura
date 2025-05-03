import express from 'express'
import userRoutes from './routes/userRoutes.js'
import connectToDB from './config/dbConnection.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'

const app = express()

connectToDB()

const corsOptions = {

}

app.use(express.json({}))
app.use(express.urlencoded({extended:true}))
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(morgan('dev'))

app.use('/api/user',userRoutes)

export default app