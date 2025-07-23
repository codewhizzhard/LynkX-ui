import React, { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom';
import logo from "../assets/landingPage/logo.png";
import sidebarData from './sidebarData';

const Nav = () => {

  const locate = useLocation();
  console.log("loca:", locate.pathname.split("/")[2])

  const [page, setPage] = useState(locate.pathname.split("/")[2]);
  
   

  //console.log("page:", locate.pathname.split("/")[2])
  //console.log("userss:", locate.pathname.split("/")[2][0].toUpperCase() + locate.pathname.split("/")[2].slice(1))
  const { userType } = useParams();
  //console.log("user", userType)
  
  //console.log("data:", sidebarData[userType].map((data, index) => data.to.slice(1)))

  return (
    <nav className='bg-[#202225] rounded-[20px] pt-10 w-[20%] px-5'>
        <Link className='flex items-center gap-4' to={"/"}>
                <div className='h-[39px] w-[24px]'>
                    <img src={logo} alt="logo" className='object-cover w-full'/>
                </div>
                <h1 className='font-bold text-2xl italic text-white'>LynkX</h1>
            </Link>
            <div className='flex flex-col justify-between h-[85%]'>
              <ul className='flex flex-col text-white text-[16px] italic font-semibold gap-3 pt-14 '>
              {sidebarData[userType].map((data, index) => (
                <Link to={`/${userType}${data.to}`}> <li key={index} className={`cursor-pointer py-3 px-2 rounded-[5px] ${data.to.slice(1) === page ? "bg-[#009FBD] " : ""}`} onClick={() => setPage(data.to.slice(1))}>{data.name}</li></Link>
              ))}
            </ul>
            <div className='text-red-500/70 text-[16px] italic font-semibold cursor-pointer'>Logout</div>

            </div>
            
    </nav>
  )
}

export default Nav