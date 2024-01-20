import bcryptjs from 'bcryptjs'
import User from '../models/user.model.js' 
import { errorHandler } from '../utills/error.js'
import jwt from 'jsonwebtoken'

export const signup = async (req,res,next)=>{
    try{
        const { username , email , password } = req.body;
        if(!username || !email || !password){
            return next(errorHandler(401,'Fill all fields'))
        }
        const hashedPassword = bcryptjs.hashSync(password,10)
        
        const newUser = new User({username , email , password:hashedPassword})
        await newUser.save();

        return res.status(201).json("User created successfully")

    }catch(err){
        next(err)
    }
}

export const signin = async (req, res, next)=>{
    try{
        const { email , password } = req.body;
        const validUser = await User.findOne({ email });
        if(!validUser){
            return next(errorHandler(404,"User Not Found"));
        }
        const isValidPass = bcryptjs.compareSync(password,validUser.password);
        if(!isValidPass){
            return next(errorHandler(401,"Wrong credentials"));
        }
        const token = jwt.sign({ id : validUser._id } , process.env.JWT )
        const { password:pass , ...rest } = validUser._doc;
        res
        .cookie('access_token',token,{httpOnly:true})
        .status(200)
        .json(rest)
    }catch(err){
        next(err);
    }
}