import React, { useEffect, useState } from 'react'
import { FiArrowDown, FiArrowLeft, FiArrowUp, FiCheck, FiCopy, FiDollarSign } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import UseThrottleFunction from '../../hooks/useThrottleFunction';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import lynkXData from '../../service/axios';
import { useAbi } from "../../context/abiContext";
import {  useReadContract, useWriteContract, useChainId, useAccount } from "wagmi";
import { useApproveUSDC } from '../../hooks/circleHooks/approve';
import "./scroll.css"

/* // Map Wagmi chain IDs to your backend keys
function normalizeChainName(chainId) {
  switch (chainId) {
    case 1: return "ethereumSepolia";
    case 43113: return "avalancheFuji";
    case 84532: return "baseSepolia";
    case 421614: return "arbitrumSepolia";
    case 11155420: return "opSepolia";
    default: return null;
  }
}
 */
const Receive = () => {
  const chainId = useChainId();





    const {address, isConnected} = useAccount();

    const [wallets, setWallets] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [link, setLink] = useState("");
    const [copied, setCopied] = useState(false)
    const [loader, setLoader] = useState(false)
    const [walletLoader, setWalletLoader] = useState(false)
    const [generateErr, setGenerateErr] = useState("")
      
    const receiveSchema = z.object({
        productName: z.string().optional(),
        orderId: z.string().optional(),
        address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid address"),
         amount: z.string().min(1, "required"),
        blockchain: z.string().min(3, "Blockchain required"),
        walletId: z.string().min(5, "too short")
    })

    const {register, handleSubmit, reset, setValue, formState: {isSubmitting, errors}} = useForm({
                resolver: zodResolver(receiveSchema)
            })


    const handleCopy = async (text) => {
        try {
             await navigator.clipboard.writeText(text);
            setCopied("Copied");
            console.log("copy", copied)
             setTimeout(() => {
                setCopied("")
            }, 1000) 
           
        } catch (error) {
           console.log("Error copying address:", error);
        } 
    }
    const throttleCopy = UseThrottleFunction(handleCopy, 1000);

     const handleGenerate = async (data) => {
        console.log("dd:", data)
        setLink("");
        if (!isConnected) return <p>connect your wallet</p>
        setLoader(true);
        try {
            const res = await lynkXData.post("/post-payment-info", {userAddress: address, productName: data?.productName || null, orderId: data?.orderId || null, amount: data.amount, receiverAddress: data.address, blockchain: data.blockchain, walletId: data.walletId})
          
            if (res.status === 201) {
                setLink(res.data.paymentObj?.paymentLink)
            }
            setLoader(false)
        } catch (err) {
            //console.log("err:", err.message)
            setGenerateErr(err.message)
        }
    }

    const getAllUserWallet = async () => {
            if (!address) return; // avoid calling API without address
            try {
                setWalletLoader(true);
              //console.log("Fetching wallets for:", address);
              const res = await lynkXData.get(`/getUserAddresses/${address}`);
              if (res?.status === 200) {
                setWalletLoader(false);
                setWallets(res?.data?.wallets);
                //console.log("h:", res?.data?.wallets)
              }
              
            } catch (err) {
                setWalletLoader(false);
              console.error("Error fetching wallets:", err);
            }
          };
    
          useEffect(() => {
              if (isConnected && address) {
                getAllUserWallet();
              }
            }, [isConnected, address]); 

    const handleSelect = async(option) => {
        console.log("ops:", option)
        setSelectedAddress(option)
        setValue("address", option.address)
        setValue("blockchain", option.blockchain)
        setValue("walletId", option.id)
    }

   
  
  return (
    <section className=' flex flex-col text-[#B0B0B0]'>
        <span className='border-dashed border-2 border-[#585858] py-1 px-2 justify-center text-[18px] italic flex'>
            Generate Link
        </span>
            <div className='flex-grow h-[75vh] pt-3 flex justify-center'>
                <form className={`w-[80%] h-[90%] bg-[#202225] rounded-[30px] items-center p-2 pt-10 text-[#292C31] flex flex-col ${link ? "gap-6" : "gap-10"}`} onSubmit={handleSubmit(handleGenerate)}>
                    <div className='flex flex-col gap-7 items-center w-full '>
                        <div className='flex w-full'>
                            <span className='flex flex-col items-center w-[80%]'>
                            <input type="text" className='bg-[#B0B0B0] w-[85%] py-4 rounded-[7px] px-3 outline-none' placeholder='product name:optional' {...register("productName")}/>
                            {errors?.productName && <p className='text-red-500 text-[12px] w-[50%] flex justify-start mt-0'>{errors.productName?.message}</p>} 
                        </span>
                        <span className='flex flex-col w-[80%] items-center'>
                            <input type="text" className='bg-[#B0B0B0]  py-4 rounded-[7px] px-3 outline-none w-[85%]' placeholder='order id:optional' {...register("orderId")}/>
                            {errors?.orderId && <p className='text-red-500 text-[12px] w-[50%] flex justify-start mt-0'>{errors.orderId?.message}</p>} 
                        </span>
                        </div>
                        <div className='flex justify-between w-full'>
                            <span className='flex flex-col w-[100%] items-center relative'>
                                <FiDollarSign className='absolute top-[20px] left-8'/>
                            <input type="text" className='bg-[#B0B0B0] w-[85%] py-4 rounded-[7px] pl-5 outline-none' placeholder='amount: compulsory' {...register("amount")}/>
                            {errors?.amount && <p className='text-red-500 text-[12px] w-[85%] flex justify-start mt-1'>{errors.amount?.message}</p>} 
                        </span>
                        <span className='flex flex-col items-center w-[100%] relative'>
                            <div className='bg-[#B0B0B0] w-[85%] py-4 rounded-[7px] px-3 outline-none flex justify-between items-center cursor-pointer'   onClick={() => setOpen((prev) => !prev)}>{selectedAddress ? selectedAddress?.walletName.toUpperCase() : "pick a chain"} {open ? <FiArrowUp className='text-[20px]'/> : <FiArrowDown className='text-[20px]' /> }</div>
                            {open && wallets &&  (
                                <div className="absolute mt-2 bg-white rounded-[10px] shadow-lg z-10 w-[85%] top-13 h-34 py-2 overflow-y-auto scroll-invisible flex flex-col gap-2">
                                    {walletLoader ? <p className='text-gray-500 text-center'>Loading wallets...</p> : wallets?.length === 0 && <p className='text-gray-500 text-center'>No wallets found</p>}
                                    {wallets?.length > 0 && wallets.map((wallet, i) => (
                                    <div
                                    key={i}
                                    onClick={() => {handleSelect(wallet); setOpen(false)}}
                                    className=" p-1 pl-2 bg-gray-100 cursor-pointer border-[#009FBD] border-y rounded-[10px] "
                                    >
                                    <div className="font-bold flex gap-4">{wallet.walletName.toUpperCase() || "Unnamed"} <span className='text-[15px] text-[#0a5c6c]'>{wallet.blockchain}</span></div>
                                    <div className="text-[13px] text-gray-500">
                                        {wallet.address}
                                    </div>
                                    
                                    </div>
                                ))}
                                </div>
                            )}
                            {/* <input type="text" className='bg-[#B0B0B0] w-[85%] py-4 rounded-[7px] px-3 outline-none' placeholder='pick one' {...register("address")}/> */}
                            {errors?.address && <p className='text-red-500 text-[12px] w-[85%] flex justify-start mt-1'>{errors.address?.message}</p>} 
                        </span>
                        </div>
                        
                        {loader ? <p className='text-white my-0'>Loading...</p> : link && <p className=' leading-none italic text-[14px] flex gap-3 cursor-pointer hover:underline text-[#B0B0B0]' onClick={() => throttleCopy(link)} >{link} <span>{copied ? <FiCheck className=''  /> : <FiCopy className=''  />}</span> </p>}
                    </div>
                     <div className='flex justify-between w-[80%]'>
                        <button className='text-white bg-[#202225] py-3 px-8 rounded-[11px] text-[16px] font-semibold cursor-pointer border-2 border-[#009FBD] flex items-center gap-1' type='button' onClick={() => {reset(); setLink(""); setLoader(false); setSelectedAddress("")}}> {/* <FiArrowLeft className='text-[20px]'/> */}Clear</button>
                        <button className={`text-white py-3 px-10 rounded-[11px] text-[16px] font-semibold  ${loader ? "bg-[#011518]" : "bg-[#009FBD] cursor-p"}`} type='submit' disabled={loader}>Generate</button>
                    </div>
                </form>
            </div>
    </section>
    
  )
}

export default Receive