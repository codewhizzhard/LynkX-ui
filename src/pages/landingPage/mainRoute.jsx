import React, { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useSignMessage } from 'wagmi';
import lynkXData from '../../service/axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {useEffect} from "react";
import bg from "../../assets/landingPage/bg.png";
import logo from "../../assets/landingPage/logo.png";
import { FiArrowRight } from 'react-icons/fi';
import { Outlet } from 'react-router-dom';


const MainRoute = () => {
    const {address, isConnected} = useAccount();
    const {signMessageAsync} =  useSignMessage();

    const [signIn, setSignIn] = useState(false);

    const navigate = useNavigate();
     const locate = useLocation();
    
    /* useEffect(() => {
        const token = localStorage.getItem("token");
        if (token && isConnected) navigate("/merchant");
    }, [isConnected])
 */
   
  return (
    <div style={{backgroundImage: `url(${bg})`, backgroundSize: 'cover', fontFamily: 'ABeeZee, sans-serif' }} className='text-white min-h-[100vh]  px-12 py-6'>
        <header className='flex justify-between items-center px-2'>
            <Link className='flex items-center gap-4' to={"/"}>
                <div className='h-[39px] w-[24px]'>
                    <img src={logo} alt="logo" className='object-cover w-full'/>
                </div>
                <h1 className='font-bold text-2xl italic'>LynkX</h1>
            </Link>
            <div className='flex gap-8'>
                <Link className={`text-[18px] pt-2 italic cursor-pointer font-semibold ${locate.pathname === "/about" ? "text-[#009FBD]" : ""}`} to={"/about"}>About</Link>
                <Link to={"/roles"} className={`text-[18px] pt-2 italic cursor-pointer font-semibold ${locate.pathname === "/roles" ? "text-[#009FBD]" : ""}`} >Roles</Link>
                <span>{address ? <p className='text-[18px] mt-[6px] italic border-2 border-[#009FBD] rounded-[10px] px-4 font-semibold'>{`${address.slice(0,3)}...${address.slice(-3)}`}</p> : <ConnectButton />}</span>
            </div>
        </header>
        <Outlet />
    </div>
  )
}

export default MainRoute

/*   <div style={{backgroundImage: `url(${bg})`, backgroundSize: 'cover', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <header className=''>
            <div>
                <img src="" alt="" />
                <h1>LynkX</h1>
            </div>
            <div>
                <span>About</span>
                <span>Connect Wallet</span>
            </div>
        </header>

        <main>
            <div></div>
            <div></div>
        </main>
    </div>*/