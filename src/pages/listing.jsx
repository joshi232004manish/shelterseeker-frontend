import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import {Swiper,SwiperSlide} from 'swiper/react'
import SwiperCore from 'swiper'
import { useSelector} from "react-redux"

import {Navigation} from 'swiper/modules'
import 'swiper/css/bundle'
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import Contact from '../components/contact';


function Listing() {
  const {curUser} = useSelector((state)=>state.user);
  const [listing,setListing] = useState(null);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(false);
  const [contact, setContact] = useState(false); 
  const params = useParams();
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        console.log(params.id);
        const res = await fetch(`/api/listing/get/${params.id}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          console.log(data.message);
          setLoading(false);
          return;
        }
        setListing(data);

        console.log(data);
        
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
        console.log(error);
      }
    };
    fetchListing();
  }, []);

  return (
    <div>
      <main>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && (
        <p className='text-center my-7 text-2xl'>Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className='h-[550px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className='max-w-4xl mx-auto m-3 '>
            <h1 className='font-semibold text-3xl '>{listing.name}-${" "}
              {listing.offer ?
              listing.discountPrice.toLocaleString('en-US') :listing.regularPrice.toLocaleString('en-US')
              }{listing.type==='rent' && "/month"}</h1>
              <p className='flex gap-4 mt-1 mb-2 text-lg '>
                <FaMapMarkedAlt className='my-auto' />
                {listing.address}
              </p>
              <div className='flex flex-row gap-4'>
              {listing.type==='rent' && (
                <div className='flex  '>
                  <p className='bg-blue-800 text-white text-xl py-1 rounded-lg px-8  '>For Rent</p>
                </div>
              )
              }
              {listing.type==='sell' && (
                <div className='flex    ' >
                  <p className='bg-blue-800 text-white text-xl py-1 rounded-lg px-8  '>For Sell</p>
                </div>
              )
              }
              
              {
                listing.offer && (
                  <div className='flex  '>
                    <p className='bg-green-600 text-white px-8 py-1  rounded-lg text-xl '> ${+listing.regularPrice - +listing.discountPrice} discount</p>
                  </div>
                )
              }
              </div>
              {
                listing.description && (
                  <div className='text-lg my-4'>
                    <p ><span className='font-semibold text-xl'>Description - </span> {listing.description}</p>
                  </div>
                )
              }
              <ul className='flex gap-4 text-xl'>
                <li className='flex gap-2 bg-[#FEFFA7] p-2 rounded-lg'>
                  <FaBed className='my-auto' />
                  {
                    listing.bedRooms > 1 ? `${listing.bedRooms} bed` : `${listing.bedRooms} beds`
                  }
                  
                </li>
                <li className='flex gap-2 border bg-[#FEFFA7] p-2 rounded-lg'>
                  <FaBath className='my-auto' />
                  {
                    listing.washrooms > 1 ? `${listing.washrooms} bath` : `${listing.washrooms} baths`
                  }
                  
                </li>
                <li className='flex gap-2 bg-[#FEFFA7] p-2 rounded-lg'>
                  <FaChair className='my-auto' />
                  {
                    listing.furnished ? `Fully Furnished` : `Not Furnished`
                  }
                  
                </li>
                <li className='flex gap-2 bg-[#FEFFA7] p-2 rounded-lg'>
                  <FaParking className='my-auto' />
                  {
                    listing.parking ? `Car Parking` : `No Parking`
                  }
                  
                </li>
              </ul>
              {
                curUser && 
                // curUser._id!==listing.UserRef &&
                 !contact && (
                  <button  onClick={()=>setContact(true)} className='bg-red-600 text-white text-xl rounded-lg py-1 px-9 my-4'>Contact Landord</button>
                )
              }
              {
                contact && <Contact listing={listing}/>
              }
          </div>
        </div>
        
      )}
       
    </main>

    </div>
  )
}

export default Listing
