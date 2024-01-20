import React,{ useState } from 'react'
import { useSelector ,useDispatch } from 'react-redux'
import { Link , useNavigate } from 'react-router-dom'
import { signInFailure, signInStart, signInSuccess } from '../redux/user/userSlice'

const SignIn = () => {
  const [ formData , setFormData ] = useState({})
  const { loading , error } = useSelector((state)=> state.user)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (e)=>{
    setFormData({
      ...formData ,
      [ e.target.id ] : e.target.value ,
    })
  }


  const handleSubmit = async (e)=>{
    e.preventDefault();
    try{
    dispatch(signInStart())
    const res = await fetch('/api/auth/signin',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      body:JSON.stringify(formData),
    })
    const data = await res.json();
    if(data.success === false){
      dispatch(signInFailure(data.message))
      return;
    }
    dispatch(signInSuccess(data))
    navigate('/')
  }catch(err){
    dispatch(signInFailure(err.message))
  }
  }


  return (
    <div className='mx-auto max-w-lg p-3'>
      <h1 className='text-3xl font-semibold my-7 text-center'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
        <input 
        type="email" 
        placeholder='Enter email' 
        id="email" 
        className='border rounded-lg p-2 outline-none' 
        onChange={handleChange}
        />
        <input 
        type="password" 
        placeholder='Enter password' 
        id="password" 
        className='border rounded-lg p-2 outline-none' 
        onChange={handleChange}
        />
        <button disabled={loading} className='bg-slate-700 rounded-lg uppercase hover:opacity-95 text-white p-2 disabled:opacity-80'>
          {loading ? 'Loading..' : 'Sign In'}
          </button>
      </form>
      <div className='flex gap-2 mt-2 text-sm'>
        <p>Don't Have an account?</p>
        <Link to="/sign-up" className='text-blue-700 hover:underline'>
          Sign Up
        </Link>
      </div>
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  )
}

export default SignIn
