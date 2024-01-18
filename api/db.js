import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config();


const db = ()=>{

mongoose.connect(process.env.MONGO)
.then(()=>{
    console.log("Connected")
}).catch((err)=>{
    console.log("Error:",err)
})
}

export default db;