import React, { useState } from 'react'
import stbObject from "../../assets/landingPage/stbObject.png";
import { useAccount, useSignMessage } from 'wagmi';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import lynkXData from '../../service/axios';

const Home = () => {

    const {address, isConnected} = useAccount();

     const {signMessageAsync} =  useSignMessage();
     const [loading, setLoading] = useState(false)
     const [errMsg, setErrMsg] = useState("")


    const navigate = useNavigate();

     const handleConnectWallet = async() => {
        setLoading(true)
    if (!address || !isConnected) {
        alert("Please connect your wallet first");
        throw new Error("Wallet not connected");
    }
    try {
        const message = `Welcome to LynkX, please sign this message to connect your wallet: ${address}\nTime: ${Date.now()}`;
        const signature = await signMessageAsync({message});
        //console.log("signature:", signature);
        const post = await lynkXData.post("/auth", {
            message, address, signature
        })
        setLoading(false)
        localStorage.setItem("token", post.data.data.token);
        console.log("lynkData:", post.data.data);
        alert("Wallet connected successfully!");
        navigate("/merchant/");
    } catch (error) {
     /*  console.error('Wallet connection failed:', error) */ setLoading(false); setErrMsg(error.message)}
    }
  return (
    <main className='mt-15 flex justify-between '>
        <div className='min-w-[50%] flex flex-col gap-2'>
            <h2 className='text-[49px] leading-[115%] italic font-normal pb-5'>BECOME THE CONTROLLER OF ALL YOUR <span className='text-green-400'>FUND$</span> ON MULTICHAIN,BY PUTTING THEM ALL IN <span className='text-[#009FBD] p-2'>CIRCLE</span> ⏺️</h2>
            {isConnected &&
            <button type='button' className='cursor-pointer bg-[#009FBD] rounded-[10px] h-[39px] w-[190px] flex justify-center items-center gap-2 text-[16px] hover:bg-[#009FBD]/70' disabled={!isConnected || loading} onClick={handleConnectWallet}>{!loading ? <p className='flex items-center gap-1'>Sign in <FiArrowRight /></p> : "Loading..." } </button>}
            {!loading && errMsg && <p>{errMsg}</p>}
        </div>
        <div className='min-w-[50%] justify-end flex pl-6'>
            <img src={stbObject} alt="biggerLogo" className='h-[347px] w-[370px] '/>
        </div>
        </main>
  )
}

export default Home