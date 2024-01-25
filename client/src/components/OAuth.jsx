import React from "react";
import { GoogleAuthProvider , getAuth , signInWithPopup } from 'firebase/auth'
import { app } from '../firebase'
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInSuccess } from "../redux/user/userSlice";

const OAuth = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

    const handleGoogleClick = async ()=>{
        try{
        const provider = new GoogleAuthProvider()
        const auth = getAuth(app)
        const result = await signInWithPopup(auth,provider)

        const res = await fetch('/api/auth/google',{
            method:'POST',
            headers:{
                "Content-Type":"application/json",
            },
            body: JSON.stringify({ name : result.user.displayName,email : result.user.email,photo : result.user.photoURL
            }),
        })
        const data = await res.json()
        console.log(data)
        dispatch(signInSuccess(data))
        navigate('/')

    }catch(err){
        console.log("Google auth error" , err)
    }
}

  return (
    <button
    onClick={handleGoogleClick} 
    className="uppercase bg-red-700 hover:opacity-95 text-white rounded-lg p-2">
      Continue with google
    </button>
  );
};

export default OAuth;
