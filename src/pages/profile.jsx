import React from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react';
import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
// import  from 'redux-persist/es/storage/getStorage';
import {ref,uploadBytesResumable,getStorage,getDownloadURL} from 'firebase/storage'
import { app } from '../firebase';
import { updateUserSuccess,updateUserFailure,updateUserStart,deleteUserFailure,deleteUserStart,deleteUserSuccess,signOutUserStart,signOutUserFailure,signOutUserSuccess } from '../redux/user/userSlice';

function profile() {
  const {curUser,loading,error} = useSelector((state)=>state.user);
  const fileRef = useRef(null);
  const [file,setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError,setFileErrorUpload] = useState(false);
  const [formData,SetFormData] = useState({});
  const [updateSuccess,setUpdateSuccess] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const navigate = useNavigate();
  const [showListingError,setShowListingError]= useState(null);

  
  const dispatch = useDispatch();
  // console.log(curUser);
  // console.log(filePerc);

  console.log(file);
  console.log(formData);
  console.log(new Date().getTime());


  
  //Firebase storage
  // allow read;
  //     allow write: if 
  //     request.resource.size < 2*1024*1024 && 
  //     request.resource.contentType.matches('image/.*')
  useEffect(()=>{
    if(file) {
      handleFileUpload(file);
    }
  },[file])

  const handleFileUpload = (file)=>{
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage,fileName);
    const uploadTask = uploadBytesResumable(storageRef,file);

    uploadTask.on(
      'state_changed',(snapshot)=>{
        const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
        console.log('Upload is '+progress+'% done');
        setFilePerc(Math.round(progress));
        // console.log(filePerc);

      },
      (error)=>{
        setFileErrorUpload(true);
      },
      ()=> {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
          SetFormData({...formData,avatar:downloadURL});
        })
      }

    );
  }
  const handleChange = (e)=>{
    // console.log(e.target.value);
    SetFormData({...formData,[e.target.id]:e.target.value});

  }
  const handleSumbit = async(e)=>{
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      
      const res = await fetch(`/api/user/update/${curUser._id}`,
        {
        method:'POST',
        headers : {
          'Content-Type':'application/json'
        },
        body: JSON.stringify(formData),

    });
    const data = await res.json();
    if(data.success===false){
      dispatch(updateUserFailure(data.message));
      return;
    }
    dispatch(updateUserSuccess(data));
    setUpdateSuccess(true);
    
      
    } catch (error) {
      dispatch(updateUserFailure(data.message));
    }
  }
  const handleDeleteUser = async(e)=>{
    e.preventDefault();
    try {
      dispatch(deleteUserStart());
      const res = await fetch (`/api/user/delete/${curUser._id}`,{
        method:'DELETE'
      });
      const data = await res.json();
      if(data.success==false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));

    } catch (error) {
      dispatch(deleteUserFailure(data.message));
    }
  }

  const handleSignOut = async(e)=>{
    e.preventDefault();
    try {
      dispatch(signOutUserStart());
      const res = await fetch ('/api/auth/signout');
      const data = await res.json();
      if(data.success===false){
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signOutUserFailure(data.message))
    }
  }
  const handleShowListings = async(e)=>{
    e.preventDefault();
    try {
      const res = await fetch (`/api/user/listing/${curUser._id}`);
      const data = await res.json();
      if(data.success===false){
        setShowListingError(data.message);
        return;
      }
      setUserListings(data);
      console.log(data);
    } catch (error) {
      setShowListingError(error.message)
    }
  }

  const handleDeleteListing = async(listingId)=>{
    // e.preventDefault();
    try {
      console.log(listingId);
      console.log("hi")
      const res = await fetch (`/api/listing/delete/${listingId}`,
        {
          method:"DELETE",
        },
      );
      const data = await res.json();
      if(data.success===false) {
        console.log(data.message);
        setShowListingError(data.message);
        return;

      }
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
      // setUserListings();
      console.log(data);
    } catch (error) {
      setShowListingError(error.message);
    }
  }

  return (
    <div className='p-3 max-w-xl mx-auto'>

      <h2 className='text-4xl font-semibold text-center my-7 '>Profile</h2>
      <form onSubmit={handleSumbit} className='flex flex-col justify-center gap-6' action="">
      <input onChange={(e)=>setFile(e.target.files[0])} type="file" ref = {fileRef} hidden accept='image/*' />
      <img src={formData.avatar ||curUser.avatar} alt="" className='w-28 h-28  rounded-full mx-auto my-10 ' onClick={()=>{fileRef.current.click();console.log(fileRef);}} />
      <p className='self-center'>
        
        
          {fileUploadError? (
            <span className='self-center text-red-500'>Error image Upload</span>
          ): filePerc>0 && filePerc<100 ? (
            <span className='text-green-400'> Uploading {filePerc}% </span>
          ): filePerc===100 ? (
            <span className='self-center text-green-400'>Image Successfully Updated</span>
          ):('')
        }
        
        
      </p>
      <input type="text" id='username' placeholder='username' className=' text-2xl py-2 px-2' defaultValue={curUser.username} onChange={handleChange}  />
      <input type="text" id='email' placeholder='email' className=' text-2xl py-2 px-2 ' defaultValue={curUser.email} onChange={handleChange}/>
      <input type="password" id='password' placeholder='password' className='text-2xl py-2 px-2'  onChange={handleChange}  />
      <button disabled={loading} className='text-2xl bg-slate-700 text-white  py-2 px-2 ' >
        {loading? 'Loading..':'Update'}
        </button>
        <Link to={"/listing"} >
      <button className='text-2xl bg-green-400 px-2' >Create Listings</button>
      </Link>
      <ul className='flex justify-between'>
      <li><a href="" onClick={handleDeleteUser}>Delete Account</a></li>
      <li><a href="" onClick={handleSignOut}>Sign Out</a></li>
      </ul>
      <span className='mx-auto'><a onClick={handleShowListings} href="">Show Listings</a></span>
      <p className='text-red-700 mt-5'>
        {showListingError ? showListingError : ''}
      </p>
      {
        userListings && 
        (<div>
          <h2 className='text-4xl font-semibold text-center mb-5'>Your Listings</h2>
          {
            userListings.map((listing)=>{
              return(<div className='flex mx-auto text-center justify-between my-4 border rounded-lg p-2 ' key={listing._id}>
                <div>
                 <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>
              </div>
              <div className='flex flex-col justify-center '>
                <button onClick={()=>handleDeleteListing(listing._id)} className='text-red-700 uppercase '>Delete</button>
                <Link to={`/updatelisting/${listing._id}`} >
                <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
              </div>)
            })
          }
        </div>
      )}

      <p>{error? error:''}</p>
      <p>{updateSuccess? 'User updated Successfully':''}</p>
      
      </form>
    </div>
  )
}

export default profile
