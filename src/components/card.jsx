import React from 'react'
import { Link } from 'react-router-dom'
import {MdLocationOn} from 'react-icons/md'

export default function card({listing}) {
  return (
    <div className='text-lg'>
      <Link to={`/listing/${listing._id}`}>
        <div className='w-full sm:w-[330px] flex flex-col'>
          <div>
          <img  className='w-full sm:w-[330px] rounded-lg' src={listing.imageUrls[0] || "https://marketplace.canva.com/EAF6nmbUlhg/1/0/1600w/canva-black-and-gold-flat-illustrative-real-estate-logo-Jj0rP4nw9ug.jpg"} alt="" />
          </div>
          <div className='pl-3 mx-2 my-2'>
            <p className='text-2xl font-semibold'>{listing.name}</p>
            <div  className='flex gap-2 text-green-700 '>
            <MdLocationOn className='h-5 w-5 my-auto' />
            <p>{listing.address}</p>
            </div>
            <div>
              <p className='truncate'>{listing.description}</p>
            </div>
            <p className='text-slate-500 mt-2 font-semibold '>
            $
            {listing.offer
              ? listing.discountPrice.toLocaleString('en-US')
              : listing.regularPrice.toLocaleString('en-US')}
            {listing.type === 'rent' && ' / month'}
          </p>
          <div className='text-slate-700 flex gap-4'>
            <div className='font-bold text-xs'>
              {listing.bedRooms > 1
                ? `${listing.bedRooms} beds `
                : `${listing.bedRooms} bed `}
            </div>
            <div className='font-bold text-xs'>
              {listing.washrooms > 1
                ? `${listing.washrooms} baths `
                : `${listing.washrooms} bath `}
            </div>
          </div>
            
          </div>
        </div>
      </Link>
    </div>
  )
}
