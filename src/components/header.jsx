import React from 'react'
import {useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { useEffect,useState } from 'react';
import { FaSearch } from 'react-icons/fa';

function header() {
  const currentUser = useSelector((state)=>state.user);
  const navigate = useNavigate(); 
  const [searchTerm,setSearchTerm] = useState('');
  console.log(currentUser);


const handleSubmit = async(e)=>{
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
};




useEffect(() => {
  const urlParams = new URLSearchParams(location.search);
  const searchTermFromUrl = urlParams.get('searchTerm');
  if (searchTermFromUrl) {
    setSearchTerm(searchTermFromUrl);
  }
}, [location.search]);

  return (
    <header>
    <div className='flex justify-evenly bg-slate-200  p-5 '>
      <div>
        <h2><span className='text-4xl text-green-400 font-extrabold'>Shelter</span><span className='text-4xl text-blue-400 font-extrabold'>Seeker</span></h2>
      </div>
      <form
          onSubmit={handleSubmit}
          className='bg-slate-100 p-3 rounded-lg flex items-center'
        >
          <input
            type='text'
            placeholder='Search...'
            value={searchTerm}
            className='bg-transparent focus:outline-none w-24 sm:w-64 text-lg'
            
            onChange={(e) => setSearchTerm(e.target.value)}
          />
           <button>
            <FaSearch className='text-slate-600' />
          </button>
        </form>
      <div className='flex gap-20 list-none align-middle '>
        <li className='self-center hidden sm:inline  hover:underline'><a href="/" className='text-xl hover:underline-0'>Home</a></li>
        <li className='self-center hidden sm:inline  hover:underline'><a href="/about" className='text-xl'>About</a></li>
        <li className='self-center hidden sm:inline  hover:underline'>
          <Link to='/profile'>
            {
              currentUser.curUser ? (
                <img className='rounded-full w-10 h-10 ' src={currentUser.curUser.avatar} alt="profile" />

              ):(
                <li className='text-xl'>Sign In</li>
              )
            }
          </Link>
          
        
        </li>
      </div>
    </div>
    </header>
  )
}

export default header
