import React,{ useState } from 'react'
import { Link , useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth'

const SignUp = () => {
  const [ formData , setFormData ] = useState({})
  const [ loading , setLoading ] = useState(false)
  const [ error , setError ] = useState(null)

  const navigate = useNavigate()

  const handleChange = (e)=>{
    setFormData({
      ...formData ,
      [ e.target.id ] : e.target.value ,
    })
  }


  const handleSubmit = async (e)=>{
    e.preventDefault();
    try{
    setLoading(true)
    const res = await fetch('/api/auth/signup',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      body:JSON.stringify(formData),
    })
    const data = await res.json();
    if(data.success === false){
      setLoading(false)
      setError(data.message)
      return;
    }
    setLoading(false);
    navigate('/sign-in')
    setError(null)
  }catch(err){
    setLoading(false)
    setError(err.message)
    console.log(err.message)
  }
  }


  return (
    <div className='mx-auto max-w-lg p-3'>
      <h1 className='text-3xl font-semibold my-7 text-center'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
        <input 
        type="text" 
        placeholder='Enter username' 
        id="username" 
        className='border rounded-lg p-2 outline-none' 
        onChange={handleChange}
        />
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
          {loading ? 'Loading..' : 'Sign Up'}
          </button>
          <OAuth/>
      </form>
      <div className='flex gap-2 mt-2 text-sm'>
        <p>Have an account?</p>
        <Link to="/sign-in" className='text-blue-700 hover:underline'>
          Sign in
        </Link>
      </div>
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  )
}

export default SignUp
