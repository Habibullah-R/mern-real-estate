import bcryptjs from 'bcryptjs'
import User from '../models/user.model.js' 

export const signup = async (req,res)=>{
    try{
        const { username , email , password } = req.body;
        if(!username || !email || !password){
            return res.send("Fill all fields")
        }
        const hashedPassword = bcryptjs.hashSync(password,10)
        
        const newUser = new User({username , email , password:hashedPassword})
        await newUser.save();

        return res.status(201).json("User created successfully")

    }catch(err){
        return res.status(500).json(err.message)
    }
}