import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useAccount } from 'wagmi';
import profile from "../assets/pages/userImage.png";
import { FiCheck, FiCopy } from 'react-icons/fi';
import UseThrottleFunction from '../hooks/useThrottleFunction';
import lynkXData from '../service/axios';

const MainBody = () => {

    const {address, isConnected} = useAccount();
    
    const [copied, setCopied] = useState(false)

    let username = "User";
    
    const handleCopy = async (text) => {
        try {
             await navigator.clipboard.writeText(text);
            setCopied(true);
            console.log("copy", copied)
             setTimeout(() => {
                setCopied(false)
            }, 1000) 
           
        } catch (error) {
           console.log("Error copying address:", error);
        } 
    }
    const throttleCopy = UseThrottleFunction(handleCopy, 1000);
    const getUserDetails = async () => {
        
        try {
            
            const res = await lynkXData.get(`/getUserDetails/${address}`);
            //console.log("details:", res?.data?.data)
            localStorage.setItem("userDetails", JSON.stringify(res?.data?.data));
            username = res?.data?.data?.username
        } catch (err) {
            console.log("err:", err)
        }   
      
    }
    useEffect(() => {
        if (address) {
        getUserDetails()
        }
    }, [address])

    const userdetails = localStorage.getItem("userDetails");
    let user;
    if(userdetails) {
         user = JSON.parse(userdetails);
    }

     username = user?.username
    
  return (
    <div className='pt-7 w-full'>
        <header className='flex justify-between w-full text-[#B0B0B0] items-center'>
            <h2 className=' italic text-[19px] font-semibold'>WELCOME!</h2>
            <div className='flex gap-2 items-center'>
                <span className='flex flex-col items-end gap-1'>
                    <h3 className=' leading-none font-semibold text-[14px] '>{username ? username : "User"}</h3>
                    <p className=' leading-none italic text-[14px] flex gap-1 cursor-pointer hover:underline' onClick={() => throttleCopy(address)} > <span>{copied ? <FiCheck className=''  /> : <FiCopy className=''  />} </span>{isConnected ? address : "Not connected"} </p>
                </span>
                <div className='w-[57px] h-[57px] rounded-[100%] border-2 border-dashed'><img src={profile} alt="" /></div>
            </div>
        </header>
        <main className='pt-8 overflow-hidden'>
            <Outlet />
        </main>
    </div>
  )
}

export default MainBody