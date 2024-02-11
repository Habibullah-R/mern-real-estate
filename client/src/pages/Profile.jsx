import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  deleteFailure,
  deleteSuccess,
  deleteStart,
  updateFailure,
  updateStart,
  updateSuccess,
  signOutFailure,
  signOutStart,
  signOutSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from 'react-router-dom'


const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef();
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateS, setUpdateS] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        console.log(uploadTask.snapshot);
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(updateFailure(data.message));
        return;
      }

      dispatch(updateSuccess(data));
      setUpdateS(true);
    } catch (error) {
      dispatch(updateFailure(error.message));
    }
  };


  const deleteUser = async ()=>{
    try{
      dispatch(deleteStart())
      const res = await fetch(`api/user/delete/${currentUser._id}`,{
        method:'DELETE',
      })
      const data = await res.json()

      if (data.success === false) {
        dispatch(deleteFailure(data.message));
        return;
      }

      dispatch(deleteSuccess(data))



    }catch(err){
      dispatch(deleteFailure(err.message))
    }
  }


  const signOutUser = async ()=>{
    try{
      dispatch(signOutStart())
      const res = await fetch('api/auth/signout')
      const data = await res.json()

      if (data.success === false) {
        dispatch(signOutFailure(data.message));
        return;
      }

      dispatch(signOutSuccess(data))


    }catch(err){
      dispatch(signOutFailure(err.message))
    }
  }


  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-center my-3">Profile</h1>
      <form onSubmit={handleSubmit} action="" className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          accept="image/*"
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
          hidden
        />
        <img
          className="hover:cursor-pointer h-24 w-24 rounded-full mx-auto"
          src={ currentUser.avatar || formData.avatar }
          alt=""
          onClick={() => fileRef.current.click()}
        />
        <p className="text-sm text-center h-2">
          {fileUploadError ? (
            <span className="text-red-700">Error Image Upload</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Uploaded successfully</span>
          ) : (
            " "
          )}
        </p>
        <input
          id="username"
          className="p-3 border rounded-lg"
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          id="email"
          className="p-3 border rounded-lg"
          type="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          id="password"
          className="p-3 border rounded-lg"
          type="password"
          placeholder="password"
          onChange={handleChange}
        />
        <button className="uppercase p-3 bg-slate-700 text-white rounded-lg hover:opacity-95"
        disabled={loading}
        >
        {loading ? 'Loading..' : 'Update'}
        </button>
        <Link to='/create-listing' className="bg-green-700 text-center uppercase text-white p-3 rounded-lg hover:opacity-95">
          CReate listing
        </Link>
      </form>
      <div className="flex justify-between mt-2">
        <span className="text-red-700 cursor-pointer hover:underline"
        onClick={deleteUser}
        >
          Delete Account
        </span>
        <span className="text-red-700 cursor-pointer hover:underline"
        onClick={signOutUser}
        >
          Sign Out
        </span>
      </div>

      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">{updateS ? "Success" : ""}</p>
    </div>
  );
};

export default Profile;
