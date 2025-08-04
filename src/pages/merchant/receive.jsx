import React, { useEffect, useState } from 'react'
import { FiArrowDown, FiArrowLeft, FiArrowUp, FiCheck, FiCopy } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import UseThrottleFunction from '../../hooks/useThrottleFunction';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import lynkXData from '../../service/axios';
import { useAccount } from 'wagmi';


const Receive = () => {

    const {address, isConnected} = useAccount();

    const [wallets, setWallets] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [link, setLink] = useState("");
    const [copied, setCopied] = useState(false)
       /*  const handleCopy = async (text) => {
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
    const throttleCopy = UseThrottleFunction(handleCopy, 1000); */

    




  

    const receiveSchema = z.object({
        productName: z.string().optional(),
        orderId: z.string().optional(),
        address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid address"),
        amount: z.string().min(1, "Amount is required"),
        blockchain: z.string().min(3, "Blockchain required")
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
        try {
            console.log("conecting")
            const res = await lynkXData.post("/post-payment-info", {userAddress: address, productName: data?.productName || null, orderId: data?.orderId || null, amount: data.amount, receiverAddress: data.address, blockchain: data.blockchain})
            console.log("conected")
            if (res.status === 201) {
                console.log("pay", res.data.paymentObj?.paymentLink)
                setLink(res.data.paymentObj?.paymentLink)
            }

        } catch (err) {
            console.log("err:", err)
        }
    }

    const getAllUserWallet = async () => {
            if (!address) return; // avoid calling API without address
            try {
              //console.log("Fetching wallets for:", address);
              const res = await lynkXData.get(`/getUserAddresses/${address}`);
              if (res?.status === 200) {
                setWallets(res?.data?.wallets);
                console.log("h:", res?.data?.wallets)
              }
              
            } catch (err) {
              console.error("Error fetching wallets:", err);
            }
          };
    
          useEffect(() => {
              if (isConnected && address) {
                getAllUserWallet();
              }
            }, [isConnected, address]); 

    const handleSelect = async(option) => {
        setSelectedAddress(option)
        setValue("address", option.address)
        setValue("blockchain", option.blockchain)
    }
  
  return (
    <section className=' flex flex-col text-[#B0B0B0]'>
        <span className='border-dashed border-2 border-[#585858] py-1 px-2 justify-center text-[18px] italic flex'>
            Generate Link
        </span>
            <div className='flex-grow h-[75vh] pt-3 flex justify-center'>
                <form className={`w-[80%] h-[90%] bg-[#202225] rounded-[30px] items-center p-2 pt-16 text-[#292C31] flex flex-col ${link ? "gap-6" : "gap-10"}`} onSubmit={handleSubmit(handleGenerate)}>
                    <div className='flex flex-col gap-10 items-center w-full '>
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
                            <span className='flex flex-col w-[100%] items-center'>
                            <input type="text" className='bg-[#B0B0B0] w-[85%] py-4 rounded-[7px] px-3 outline-none' placeholder='#amount:: compulsory' {...register("amount")}/>
                            {errors?.amount && <p className='text-red-500 text-[12px] w-[85%] flex justify-start mt-1'>{errors.amount?.message}</p>} 
                        </span>
                        <span className='flex flex-col items-center w-[100%] relative'>
                            <div className='bg-[#B0B0B0] w-[85%] py-4 rounded-[7px] px-3 outline-none flex justify-between items-center cursor-pointer'   onClick={() => setOpen((prev) => !prev)}>{selectedAddress ? selectedAddress?.walletName.toUpperCase() : "pick a chain"} {open ? <FiArrowUp className='text-[20px]'/> : <FiArrowDown className='text-[20px]' /> }</div>
                            {open && wallets &&  (
                                <div className="absolute mt-2 bg-white rounded-[10px] shadow-lg z-10 w-[85%] top-13">
                                {wallets?.length > 0 && wallets.map((wallet, i) => (
                                    <div
                                    key={i}
                                    onClick={() => {handleSelect(wallet); setOpen(false)}}
                                    className=" p-1 pl-2 bg-gray-100 cursor-pointer border-[#009FBD] border-y rounded-[10px]"
                                    >
                                    <div className="font-bold">{wallet.walletName.toUpperCase() || "Unnamed"}</div>
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
                        
                        
                        {link && <p className=' leading-none italic text-[14px] flex gap-3 cursor-pointer hover:underline text-[#B0B0B0]' onClick={() => throttleCopy(link)} >{link} <span>{copied ? <FiCheck className=''  /> : <FiCopy className=''  />}</span> </p>}
                    </div>
                     <div className='flex justify-between w-[60%]'>
                        <button className='text-white bg-[#202225] py-3 px-8 rounded-[11px] text-[16px] font-semibold cursor-pointer border-2 border-[#009FBD] flex items-center gap-1' type='button' onClick={() => {reset(); setLink("")}}> <FiArrowLeft className='text-[20px]'/>Clear</button>
                        <button className='text-white bg-[#009FBD] py-3 px-10 rounded-[11px] text-[16px] font-semibold cursor-pointer ' type='submit'>Generate</button>
                    </div>
                </form>
            </div>
    </section>
    
  )
}

export default Receive

{/* <section className='space-y-4'>
        <h2 className='text-[18px] font-bold text-center text-blue-500'>RECEIVE</h2>
        <p className='text-red-500 text-center text-[15px] font-semibold'>You can either generate a link to get usdc from any chain with circle cctp v2 or just copy and send your address to the sender which should strictly send usdc to your created chain on the platform</p>
        {!showLinkArea && <div className='flex items-center justify-center gap-4 pb-4 text-black pt-14'>
            <span className='bg-blue-100 p-4 rounded-[11px]'> CHAIN</span>
            <p className='bg-black text-white p-4 rounded-[8px]'>{userAddress}</p>
            <span className='bg-blue-100 p-4 rounded-[11px] cursor-pointer' onClick={() => throttleCopy(userAddress)}>{copied ? <FiCheck className='text-[20px]'  /> : <FiCopy className='text-[20px]'  />}</span> {/* <FiCopy className='text-[20px]'  /></ 
        </div>}
         only display this area for merchant as Liquidity Provider dont need to generate Link
        { userType === "merchant" && 
        <div className='flex items-center w-full justify-center'>
            {!showLinkArea &&<button className='text-white font-semibold text-[16px] cursor-pointer bg-blue-500 p-4 rounded-[11px] mt-6 ' type='button' onClick={() => setShowLinkArea(true)}>Generate Link</button>}
            { showLinkArea && (
                <form className='border-r-15 border-l-15 border-r-red-500 border-l-blue-500 w-[60%] space-y-4 p-3 rounded-[11px] text-gray-800'>
                    <h3 className='text-[15px] font-bold text-center'>Generate Link</h3>
                    <div className='flex flex-col space-y-2'>
                        <label htmlFor="" className='text-[14px] font-semibold'>Order Id</label>
                        <input type="text" className='outline-none bg-blue-100 p-2 pl-4 rounded-[11px]' placeholder='#246'/>
                    </div>
                    <div className='flex flex-col space-y-2'>
                        <label htmlFor="" className='text-[14px] font-semibold'>Product Name</label>
                        <input type="text" className='outline-none bg-blue-100 p-2 rounded-[11px] pl-4' placeholder='adidas adilette'/>
                    </div>
                    <div className='flex flex-col space-y-2'>
                        <label htmlFor="" className='text-[14px] font-semibold'>Amount To Receive</label>
                        <input type="text" className='outline-none bg-blue-100 p-2 rounded-[11px] pl-4' placeholder='$400'/>
                    </div>
                    {showLink &&
                        
                            <div className='flex items-center justify-center gap-4 p-2'>
                            <p className='bg-black text-white p-2 px-4 rounded-[8px] font-semibold'>{userAddress}</p>
                            <span className='bg-blue-100 p-2 rounded-[8px] cursor-pointer' onClick={() => throttleCopy(userAddress)}>{copied ? <FiCheck className='text-[20px]'  /> : <FiCopy className='text-[20px]'  />}</span> 
                        </div>}
                    <div className='flex justify-between'>
                        <button className='text-red-500 bg-blue-100 p-4 rounded-[11px] text-[16px] font-semibold cursor-pointer' type='button' onClick={() => setShowLinkArea(false)}>Cancel</button>
                        <button className='text-white bg-blue-500 p-4 rounded-[11px] text-[16px] font-semibold cursor-pointer' type='button'onClick={handleGenerate}>Generate</button>
                    </div>
                </form>
            )
                
                
            }
        </div> }
    </section> */}