import React from 'react'
import { useState , useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper , SwiperSlide} from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking, FaShare } from 'react-icons/fa';
import { useSelector } from 'react-redux'
import Contact from '../components/Contact';

const Listing = () => {
    const {currentUser} = useSelector((state)=>state.user)
    SwiperCore.use([Navigation]);
    const params = useParams();
    const [listing,setListing] = useState(null);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(false);
    const [copied,setCopied] = useState(false);
    const [ contact , setContact ] = useState(false);


    useEffect(() => {
        const fetchListing = async()=>{
            try {
                setLoading(true);
                const res =  await fetch(`/api/listing/get/${params.listingId}`);
                const data = await res.json();
                if(data.success === false){
                    setError(true);
                    setLoading(false);
                    return;
                }
                setLoading(false);
                setListing(data);
                setError(false);

            } catch (error) {
                setError(true);
                setLoading(false);
            }
        }
        fetchListing();
    }, [params.listingId])
    
  return (
    <main>
        { loading && <p className='text-center my-7 text-3xl'>Loading...</p> }
        { error && <p className='text-center my-7 text-3xl'>Something went wrong!</p> }
        { listing && !loading && !error && 
        <>
        <Swiper navigation>
            {listing.imageUrls.map((url)=>(
                <SwiperSlide key={url}>
                    <div
                    className='h-[450px]'
                    style={{
                        background:`url(${url}) center no-repeat`,
                        backgroundSize: 'cover',
                    }}>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
        <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center
        bg-slate-100 cursor-pointer">
            <FaShare
            className='text-slate-500'
            onClick={()=>{
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                    setCopied(false);
                }, 2000);
            }}/>
        </div>
        {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>Link copied!</p>
        )}
        <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-6'>
            <p
            className='text-2xl font-semibold'>
                {listing.name} - ${' '}
                {listing.offer ? 
                listing.discountPrice.toLocaleString('en-US') :  
                listing.regularPrice.toLocaleString('en-US')}
                {listing.type === 'rent' && ' / month'}
            </p>
            <p className='flex items-center gap-2 text-sm text-slate-700'>
                <FaMapMarkerAlt className='text-green-700'/>
                {listing.address}
            </p>
            <div className='flex gap-4'>
                <p className='bg-red-900 text-white p-1 rounded-md text-center w-full max-w-[200px]'>
                    {listing.type === 'rent' ? "For Rent" : "For Sale"}</p>
                    {
                        listing.offer && (
                            <p className='bg-green-900 text-white p-1 rounded-md text-center w-full max-w-[200px]'>
                    ${+listing.regularPrice - +listing.discountPrice}</p>
                        )
                    }
            </div>
            <p className='text-slate-800'>
                <span className='text-black font-semibold'>Description - {' '}</span>
                {listing.description}
            </p>
            <ul className='text-green-700 flex gap-4 sm:gap-6 font-semibold text-sm'>
                <li className='flex gap-1 items-center'>
                    <FaBed className='text-lg'/>
                    {
                        listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`
                    }
                </li>
                <li className='flex gap-1 items-center'>
                    <FaBath className='text-lg'/>
                    {
                        listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`
                    }
                </li>
                <li className='flex gap-1 items-center'>
                    <FaParking className='text-lg'/>
                    {
                        listing.parking ? 'Parking' : 'No parking'
                    }
                </li>
                <li className='flex gap-1 items-center'>
                    <FaChair className='text-lg'/>
                    {
                        listing.furnished ? 'Furnished' : 'Unfurnished'
                    }
                </li>
            </ul>
            {currentUser && listing.userRef !== currentUser._id && !contact && (
                <button
                onClick={()=>setContact(true)}
                 className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3' >Contact Landlord</button>
            )}
            {contact && <Contact listing={listing}/>}
        </div>
        </>
        }
    </main>
  )
}

export default Listing
