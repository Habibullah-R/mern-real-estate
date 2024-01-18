import express from "express"
import db from './db.js'
import userRouter from './routes/user.routes.js'
import authRouter from './routes/auth.routes.js'

const app = express()

db();
app.use(express.json())

app.listen(3000,()=>{
    console.log("Hello server...")
})

app.use('/api/user',userRouter)
app.use('/api/auth',authRouter)