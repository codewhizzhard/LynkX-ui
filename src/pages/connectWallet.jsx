import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useSignMessage } from 'wagmi';
import lynkXData from '../service/axios';
import { useNavigate } from 'react-router-dom';
import {useEffect} from "react";



const ConnectWallet = () => {
    const {address, isConnected} = useAccount();
    const {signMessageAsync} =  useSignMessage();

    const navigate = useNavigate();
    
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token && isConnected) navigate("/merchant");
    }, [isConnected])

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
            message, address: address.toLowerCase(), signature
        })
        localStorage.setItem("token", post.data.data.userToken);
        console.log("lynkData:", post);
        alert("Wallet connected successfully!");
        navigate("/merchant");
    } catch (error) {
      console.error('Wallet connection failed:', error);}
    }
  return (
    <div className='flex gap-4 w-full h-screen border-1 border-amber-200 bg-black text-white'>
        <section className='h-full w-full  flex justify-center items-center flex-col'>
            <h1 className='font-bold text-2xl'>LynkX</h1>
            <p>Welcome to LynkX</p>
        </section>
        <section className='w-full h-full flex flex-col items-center justify-center bg-gray-100 gap-10 text-black'>
        <p>{isConnected && <ConnectButton />}</p>
        {isConnected ? (<><button type='button' onClick={handleConnectWallet} className='bg-blue-500 p-4'>Sign in to LynkX</button> </>) : (<div className='w-full flex justify-center ' ><ConnectButton accountStatus="avatar" /> </div>)}
           
            <p className='text-black w-[60%]'>We use your connected address to create you with 7 different address to use to do all activities on our platform</p>
        </section>
    </div>
  )
}

export default ConnectWallet