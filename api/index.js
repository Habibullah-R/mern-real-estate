import express from "express"
import db from './db.js'
import userRouter from './routes/user.routes.js'
import authRouter from './routes/auth.routes.js'
import cookieParser from 'cookie-parser'

const app = express()

db();
app.use(express.json())

app.use(cookieParser())

app.listen(3000,()=>{
    console.log("Hello server...")
})

app.use('/api/user',userRouter)
app.use('/api/auth',authRouter)

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    })
})