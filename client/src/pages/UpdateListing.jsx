import React, { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from 'react-redux'
import { useNavigate , useParams } from 'react-router-dom'
import { useEffect } from "react";

const CreateListing = () => {
  const navigate = useNavigate()
  const { currentUser } = useSelector(state=>state.user)
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error,setError] = useState(false)
  const [loading , setLoading] = useState(false)
  const params = useParams()



  useEffect(() => {
   const fetchListing = async ()=>{
    const listingId = params.listingId;
    const res = await fetch(`/api/listing/get/${listingId}`)
    const data = await res.json();
    if(data.success === false){
        console.log(data.message)
        return;
    }
    setFormData(data)
   }
   fetchListing();
  }, [])
  


  // Images submition

  const handleImageSubmit = () => {
    if (files.length === 0) {
      setImageUploadError("Please select images.");
      return;
    }
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image Upload error (max size 2mb)");
        });
    } else {
      setImageUploadError("You can upload only 6 images.");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  // Remove image

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };



// Data to formData state
  const handleChange = (e) => {

    if(e.target.id === 'sale' || e.target.id === 'rent'){
      setFormData({
        ...formData,
        type:e.target.id
      })
    }

    if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
      setFormData({
        ...formData,
        [e.target.id] : e.target.checked
      })
    }

    if(e.target.type === 'text' || e.target.type === 'textarea' || e.target.type === 'number'){
      setFormData({
        ...formData,
        [e.target.id] : e.target.value
      })
    }

  };


  const handleSubmit = async (e)=>{
    e.preventDefault();
    setError(false)
    try{
      if(formData.imageUrls.length < 1) return setError("You must upload atleast one image.")
      if(formData.discountPrice >= formData.regularPrice ) return setError('Discounted price must be less than Regular price.')
      
    setLoading(true)
      const res = await fetch(`/api/listing/update/${params.listingId}`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      body:JSON.stringify({
        ...formData,
        userRef: currentUser._id,
      }),
    })
    const data = await res.json();
    setLoading(false)
    if(data.success === false){
      setError(data.message)
      return;
    }
    navigate(`/listing/${data._id}`)

    }catch(err){
      setError(err.message)
      setLoading(false)
    }
  }


  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h2 className="text-center font-semibold text-3xl my-7">
        Update a Listing
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            id="name"
            name="name"
            maxLength="62"
            minLength="10"
            required
            className="p-3 rounded-lg border focus:outline-blue-700 "
            placeholder="Name"
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type="text"
            name="description"
            id="description"
            required
            className="p-3 rounded-lg border focus:outline-blue-700"
            placeholder="Description"
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            name="address"
            id="address"
            required
            className="p-3 rounded-lg border focus:outline-blue-700"
            placeholder="Address"
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex gap-2 items-center">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border rounded-lg border-gray-300"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border rounded-lg border-gray-300"
                onChange={handleChange}
              value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="10000"
                required
                className="p-3 border rounded-lg border-gray-300"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>

            {formData.offer && (
               <div className="flex gap-2 items-center">
               <input
                 type="number"
                 id="discountPrice"
                 min="0"
                 max="10000"
                 required
                 className="p-3 border rounded-lg border-gray-300"
                 onChange={handleChange}
                 value={formData.discountPrice}
               />
               <div className="flex flex-col items-center">
                 <p>Discounted Price</p>
                 <span className="text-xs">($ / month)</span>
               </div>
             </div>

            )}

          </div>
        </div>

        <div className="flex flex-col gap-4 flex-1">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover. (max-6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              type="file"
              accept="image/*"
              multiple
              id="images"
              onChange={(e) => {
                setFiles(e.target.files);
              }}
              className="border border-gray-300 rounded p-3 w-full"
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="border p-3 uppercase border-green-700 text-green-700 rounded hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading... " : "Upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className=" flex justify-between p-3 border items-center rounded-lg"
              >
                <img
                  src={url}
                  className="object-cover rounded-lg w-20 h-20"
                  alt=""
                />
                <button
                  type="button"
                  className="text-red-700 uppercase p-3  hover:opacity-70"
                  onClick={() => handleRemoveImage(index)}
                >
                  Delete
                </button>
              </div>
            ))}
          <button disabled={loading || uploading} className="bg-slate-700 uppercase text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-80">
            {loading ? 'Updating...' : 'Update Listing'}
          </button>
          {error && <p className="text-red-700 text-xs ">{error}</p> }
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
