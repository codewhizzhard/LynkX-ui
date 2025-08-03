import React, { useState } from 'react'
import { FiArrowLeft, FiCheck, FiCopy } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import UseThrottleFunction from '../../hooks/useThrottleFunction';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';


const Receive = () => {

    const [showLinkArea, setShowLinkArea] = useState(false);
    const [showLink, setShowLink] = useState(false);
    const [copied, setCopied] = useState(false)

    

    const { userType } = useParams();

    const userAddress = "0xcAb180b62D3cC891802E072aF06197F012ccE736";

    const receiveSchema = z.object({
        productName: z.string().optional(),
        orderId: z.string().optional(),
        address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid address"),
        amount: z.string().min(1, "Amount is required"),
    })

    const {register, handleSubmit, setValue, formState: {isSubmitting, errors}} = useForm({
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
     const handleGenerate = (data) => {
        setShowLink(true);
        console.log("ee:", data)
    }
  
  return (
    <section className=' flex flex-col text-[#B0B0B0]'>
        <span className='border-dashed border-2 border-[#585858] py-1 px-2 justify-center text-[18px] italic flex'>
            Generate Link
        </span>
            <div className='flex-grow h-[75vh] pt-3 flex justify-center'>
                <form className='w-[80%] h-[90%] bg-[#202225] rounded-[30px] p-2 pt-6 text-[#292C31] flex items-center flex-col gap-10' onSubmit={handleSubmit(handleGenerate)}>
                    <div className='flex flex-col gap-4 items-center w-full'>
                        <span className='flex flex-col w-full items-center'>
                            <input type="text" className='bg-[#B0B0B0] w-[60%] py-2 rounded-[7px] px-3 outline-none' placeholder='#product name:optional' {...register("productName")}/>
                            {errors?.productName && <p className='text-red-500 text-[12px] w-[50%] flex justify-start mt-0'>{errors.productName?.message}</p>} 
                        </span>
                        <span className='flex flex-col w-full items-center'>
                            <input type="text" className='bg-[#B0B0B0]  py-2 rounded-[7px] px-3 outline-none w-[60%]' placeholder='#order id:optional' {...register("orderId")}/>
                            {errors?.orderId && <p className='text-red-500 text-[12px] w-[50%] flex justify-start mt-0'>{errors.orderId?.message}</p>} 
                        </span>
                        <span className='flex flex-col w-full items-center'>
                            <input type="text" className='bg-[#B0B0B0] w-[60%] py-2 rounded-[7px] px-3 outline-none' placeholder='#amount to receive:compulsory' {...register("amount")}/>
                            {errors?.amount && <p className='text-red-500 text-[12px] w-[60%] flex justify-start mt-0'>{errors.amount?.message}</p>} 
                        </span>
                        <span className='flex flex-col w-full items-center'>
                            <input type="text" className='bg-[#B0B0B0] w-[60%] py-2 rounded-[7px] px-3 outline-none' placeholder='#address you want to receive the money to:compulsory' {...register("address")}/>
                            {errors?.address && <p className='text-red-500 text-[12px] w-[60%] flex justify-start mt-0'>{errors.address?.message}</p>} 
                        </span>
                    </div>
                     <div className='flex justify-between w-[60%]'>
                        <button className='text-white bg-[#202225] py-3 px-8 rounded-[11px] text-[16px] font-semibold cursor-pointer border-2 border-[#009FBD] flex items-center gap-1' type='button' onClick={() => setShowLinkArea(false)}> <FiArrowLeft className='text-[20px]'/>Back</button>
                        <button className='text-white bg-[#009FBD] py-3 px-10 rounded-[11px] text-[16px] font-semibold cursor-pointer ' type='submit'onClick={handleGenerate}>Generate</button>
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