import React, { useState , useEffect , useRef } from "react";
import { useSelector } from "react-redux";
import { getDownloadURL, getStorage, ref , uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { updateFailure , updateStart , updateSuccess } from "../redux/user/userSlice";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef()
  const [file,setFile] = useState(undefined)
  const [filePerc,setFilePerc] = useState(0)
  const [fileUploadError,setFileUploadError] = useState(false)
  const [formData,setFormData] = useState({})


  useEffect(() => {
    if(file){
      handleFileUpload(file);
    }
  }, [file])

  const handleFileUpload = async (file)=>{
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage , fileName)
    const uploadTask = uploadBytesResumable(storageRef,file)

    
    uploadTask.on('state_changed',(snapshot)=>{
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) *100;
      setFilePerc(Math.round(progress))
    },
    (error)=>{
      setFileUploadError(true)
    },
    ()=>{
      console.log(uploadTask.snapshot)
      getDownloadURL(uploadTask.snapshot.ref).then
      ((downloadURL)=>{
        setFormData({...formData,avatar:downloadURL})
    })
    }
    )
  }

  const handleChange = (e)=>{
    setFormData({...formData,[e.target.id] : [e.target.value]})
  }

  const handleSubmit = async (e)=>{
    e.preventDefault()
    try {
      
    } catch (error) {
      
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-center my-3">Profile</h1>
      <form onSubmit={handleSubmit} action="" className="flex flex-col gap-4">
        <input type="file" 
        ref={fileRef}
        accept="image/*"
        onChange={(e)=>{setFile(e.target.files[0])}}
        hidden />
        <img
          className="hover:cursor-pointer h-24 w-24 rounded-full mx-auto"
          src={formData.avatar || currentUser.avatar }
          alt=""
          onClick={()=>fileRef.current.click()}
        />
        <p className="text-sm text-center h-2">
        {fileUploadError
        ?
        ( <span className="text-red-700">Error Image Upload</span> ) 
        : filePerc > 0 && filePerc <100 ?
        ( <span className="text-slate-700">{`Uploading ${filePerc}%`}</span> ) :
        filePerc === 100 ?
        ( <span className="text-green-700">Uploaded successfully</span> ) : 
        " "
      }
      </p>
        <input
          id="usename"
          className="p-3 border rounded-lg"
          type="text"
          placeholder="username"
          onChange={handleChange}
          value={currentUser.username}
        />
        <input
          id="email"
          className="p-3 border rounded-lg"
          type="email"
          placeholder="email"
          onChange={handleChange}
          value={currentUser.email}
        />
        <input
          id="password"
          className="p-3 border rounded-lg"
          type="text"
          placeholder="password"
        />
        <button className="uppercase p-3 bg-slate-700 text-white rounded-lg hover:opacity-95">
          Update
        </button>
      </form>
      <div className="flex justify-between mt-2">
        <span className="text-red-700 cursor-pointer hover:underline">
          Delete Account
        </span>
        <span className="text-red-700 cursor-pointer hover:underline">
          Sign Out
        </span>
      </div>
    </div>
  );
};

export default Profile;
