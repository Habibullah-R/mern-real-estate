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
        .cookie('access_token',token,{httpOnly:false})
        .status(200)
        .json(rest)
    }catch(err){
        next(err);
    }
}


export const google = async (req,res,next)=>{
    try{
        const { name , email , photo } = req.body
        const user = await User.findOne({ email })
        if(user){
            const token = jwt.sign({ id:user._id },process.env.JWT)
            const {password : pass , ...rest} = user._doc;
            res
            .cookie('access_token' , token , {httpOnly : false })
            .status(200)
            .json(rest)
        }
        else{
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword , 10);
            const newUser = new User({
                username:name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
                email ,
                password : hashedPassword,
                avatar : photo,
            })
            await newUser.save();
            const token  = jwt.sign({id:newUser._id},process.env.JWT)
            const {password : pass , ...rest} = newUser._doc;
            res
            .cookie('access_token' , token , {httpOnly : false})
            .status(200)
            .json(rest)
        }
    }catch(err){
        next(err)
    }
}


export const signout = async (req,res,next)=>{
    try{
        res.clearCookie('access_token')
        res.status(200).json('User signout')
    }catch(err){
        next(err)
    }
}