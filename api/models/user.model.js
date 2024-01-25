import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
        default:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vecteezy.com%2Ffree-vector%2Fuser-icon&psig=AOvVaw3WofSTSvzlei3lNV3R8PLm&ust=1706184647658000&source=images&cd=vfe&ved=0CBMQjRxqFwoTCJjS55__9YMDFQAAAAAdAAAAABAJ"
    }
},{timestamps:true})

const User = mongoose.model('User',userSchema)

export default User;