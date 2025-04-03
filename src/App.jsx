import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Search from './pages/search';
import Header from './components/header';
import Home from "./pages/home";
import About  from "./pages/about";
import  Profile from "./pages/profile";
import  SignIn from "./pages/signin"  ;
import  SignUp from "./pages/signup";
import  Updatelisting from "./pages/updateListing";
import PrivateRoute from './components/privateRoute';
import CreateListing from './pages/createListing';  
import Lds from './pages/listing';











export default function App() {
  return (
    <BrowserRouter>
    {/* <Routes> */}
    <Header/>
    <Routes >
      <Route path="/" element={<Home/>}></Route>
      <Route path="/about" element={<About/>}></Route>
      {/* <Route path="/profile" element={<Profile/>}></Route> */}
      <Route element={<PrivateRoute/>}  >
      
        <Route path='/profile' element={<Profile/>} ></Route>
        <Route path='/listing/:id' element={<Lds/>} ></Route>
        <Route path='/listing' element={<CreateListing/>} ></Route>
        <Route path='/updatelisting/:id' element={<Updatelisting/>}></Route>
      </Route>
      <Route path='/search' element={<Search/>}></Route>
      <Route path="/signin" element={<SignIn/>}></Route>
      <Route path="/signup" element={<SignUp/>}></Route>

    </Routes>
    </BrowserRouter>
    
    
  )
}
