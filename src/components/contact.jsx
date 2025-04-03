import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function contact({listing}) {

    const [landlord,setLandlord] = useState(null);
    const [message,setMessage] = useState('');
    const [error,setError] = useState('');
    const {curUser} = useSelector((state)=>state.user);

    useEffect(()=>{
        const fetchLandlord = async()=>{
            try {
                console.log(listing);
                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json();
                console.log(data);
                setLandlord(data);
                

            } catch (error) {
                setError(error);
            }
        };
        fetchLandlord();
        
    },[]);

    const handleChange = (e)=>{
        setMessage(e.target.value);
    }

  return (
    <div>
      {landlord &&
      (
        <div className='flex flex-col gap-4 my-4'>
           <p className='text-xl'>
            Contact <span className='font-semibold'> {landlord.username}</span> for <span className='font-semibold'>{listing.name}</span> 
            </p> 
            <textarea className='p-2 text-lg' name="" id="" placeholder='Enter your message here...' onChange={handleChange}></textarea>
            <Link
          to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
          className='bg-slate-700 text-xl text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
          >
            Send Message          
          </Link>
        </div>
      )
      }
    </div>
  )
}

export default contact
