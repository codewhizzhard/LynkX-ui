import React, { useState } from 'react'
import { FiDollarSign } from 'react-icons/fi';
import { useAccount } from 'wagmi'


const Withdraw = () => {

    const {address, isConnected} = useAccount();

    const to = isConnected && address;
    const [option, setOption] = useState("send")

  return (
      <section className=' flex flex-col text-[#B0B0B0]'>
        <span className='border-dashed border-2 border-[#585858] py-1 px-2 justify-center text-[18px] italic flex'>
            Send to other address, or withraw to connected address
        </span>
        <div className='flex-grow h-[75vh] pt-3 flex justify-center'>
            <form className='w-[80%] h-[90%] bg-[#202225] rounded-[30px] p-2 text-[#292C31] flex items-center  flex-col gap-6'>
                <div className='w-[40%] bg-[#292C31] rounded-[10px] flex justify-between cursor-pointer mt-3'>
                    <span className={`rounded-[7px] text-[16px] font-semibold text-white  px-8 py-2 ${option === "send" ? "bg-[#009FBD]" : ""}`} onClick={() => setOption("send")}>Send</span>
                    <span className={`rounded-[7px] text-[16px] font-semibold text-white  px-8 py-2 ${option === "withdraw" ? "bg-[#009FBD]" : ""}`} onClick={() => setOption("withdraw")}>Withdraw</span>
                </div>
                {
                    option === "send" && (
                        <div className='w-[60%] flex flex-col gap-8'>
                            <div className='flex flex-col gap-2'>
                                <span className='text-[#B0B0B0] font-semibold text-[16px]'>From</span>
                                <select name="" id="" className='bg-[#B0B0B0] text-[#292C31] rounded-[10px] py-3 w-full px-3 outline-none border border-[#009FBD]'>
                                    <option value="11" className='flex flex-col h-60'>name <span>{address}</span></option>
                                    <option value="11">name</option>
                                </select>
                            </div>
                            <div className='flex flex-col gap-2'>
                                <span className='text-[#B0B0B0] font-semibold text-[16px]'>To</span>
                                <input type="text" placeholder='place address here' className='bg-[#B0B0B0] text-[#292C31] rounded-[10px] py-3 w-full px-3 outline-none border border-[#009FBD]'/>
                            </div>
                        </div>
                    )
                }
                {
                    option === "withdraw" && (
                        <div className='flex flex-col mt-4'>
                            <p className='text-[16px] italic text-[#009FBD] font-semibold'>How much usdc would you like to withdraw?</p>
                            <div className='bg-[#B0B0B0] text-[#292C31] font-semibold text-[16px] relative rounded-[7px] px-4 py-1 mt-8'>  
                                <input type="text" placeholder='Enter Amount'  className=' py-2 outline-none'/>
                                <span className='absolute right-2 top-3'>usdc</span>
                            </div>
                            <p className='text-white font-semibold text-[16px] py-2 text-center'>Balance:</p>
                            <div className='flex justify-between font-semibold text-[16px] text-white mt-6 px-3'>
                                <span>Connected Wallet:</span>
                                <span>$000</span>
                            </div>
                            <div className='w-full flex justify-end  mt-8'>
                                <button className='rounded-[7px] text-[16px] font-semibold text-white px-8 py-2 bg-red-500/70 w-fit'>
                                Confirm
                                </button>

                            </div>
                            
                        </div>
                    )
                }
            </form>
        </div>
        </section>
  )
}

export default Withdraw

{/*  <section className='space-y-4'>
        <h2 className='text-[18px] font-bold text-center text-blue-500'>WITHDRAW</h2>
        <p className='text-red-500 text-center text-[15px] font-semibold'>WE will send this to your connected wallet used in signing in to the platform</p>
          <div className=' flex justify-center items-center'>
            <form className='border-r-15 border-l-15 border-r-red-500 border-l-blue-500 w-[60%] space-y-4 p-3 rounded-[11px] text-gray-800'>
                <div className='flex flex-col gap-2'>
                    <label htmlFor=""  className='text-[14px] font-semibold'>Amout</label>
                    <span className='flex gap-2 relative'> <input type="text" className=' bg-blue-100 p-2 pl-6 rounded-[11px] flex-grow outline-none' placeholder='Enter amount to withdraw' /> <button type='button' className='w-[10%] bg-red-500 rounded-[6px] cursor-pointer text-[15px] font-semibold'>Max</button> <FiDollarSign className='absolute left-2 top-[13px]'/></span>
                </div>
                <div  className='flex flex-col gap-2 pt-8'>
                    <label htmlFor=""  className='text-[14px] font-semibold'>From</label>
                    <input type="button" value={to} className=' bg-blue-100 p-2 pl-4 rounded-[11px] outline-none'/>
                </div>
                <div  className='flex flex-col gap-2'>
                    <label htmlFor=""  className='text-[14px] font-semibold'>To</label>
                    <input type="button" value={to} className=' bg-blue-100 p-2 pl-4 rounded-[11px] outline-none'/>
                </div>
                <div className='flex justify-center'><button type="button"  className='bg-blue-100 text-red-500 p-4 rounded-[11px] text-[16px] font-semibold cursor-pointer flex '>Withdraw</button></div>  
            </form>
          </div>
       <div className='fixed h-full w-full top-0 left-0 right-0 bg-black/50 z-50 flex justify-center items-center'>
            <form className='bg-gray-800'>
                <div>
                    <label htmlFor="">Amout</label>
                    <input type="text" className=' bg-blue-100 p-2 pl-4 rounded-[11px]' placeholder='Enter amount to withdraw' />
                </div>
            </form>
        </div> 
       </section> */}