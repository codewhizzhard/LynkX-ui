import React from 'react'
import stbObject from "../../assets/landingPage/stbObject.png";
import { useAccount, useSignMessage } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import lynkXData from '../../service/axios';

const Home = () => {

    const {address, isConnected} = useAccount();

     const {signMessageAsync} =  useSignMessage();


    const navigate = useNavigate();

     const handleConnectWallet = async() => {
    if (!address || !isConnected) {
        alert("Please connect your wallet first");
        throw new Error("Wallet not connected");
    }
    try {
        const message = `Welcome to LynkX, please sign this message to connect your wallet: ${address}\nTime: ${Date.now()}`;
        const signature = await signMessageAsync({message});
        console.log("signature:", signature);
        const post = await lynkXData.post("/auth", {
            message, address, signature
        })
        localStorage.setItem("token", post.data.data.userToken);
        console.log("lynkData:", post);
        alert("Wallet connected successfully!");
        navigate("/merchant/");
    } catch (error) {
      console.error('Wallet connection failed:', error);}
    }
  return (
    <main className='mt-15 flex justify-between '>
        <div className='min-w-[50%] flex flex-col gap-2'>
            <h2 className='text-[49px] leading-[115%] italic font-normal'>BECOME A MERCHANT, LIQUIDITY PROVIDER, TREASURY MANAGER, CONTROLLER OF YOUR FUND$</h2>
            {isConnected &&
            <button type='button' className='cursor-pointer bg-[#009FBD] rounded-[10px] h-[39px] w-[190px] flex justify-center items-center gap-2 text-[16px] hover:bg-[#009FBD]/70' disabled={!isConnected} onClick={handleConnectWallet}>Sign in <FiArrowRight /></button>}
        </div>
        <div className='min-w-[50%] justify-end flex pl-6'>
            <img src={stbObject} alt="biggerLogo" className='h-[347px] w-[370px] '/>
        </div>
        </main>
  )
}

export default Home