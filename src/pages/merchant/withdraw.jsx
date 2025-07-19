import React from 'react'
import { FiDollarSign } from 'react-icons/fi';
import { useAccount } from 'wagmi'


const Withdraw = () => {

    const {address, isConnected} = useAccount();

    const to = isConnected && address;

  return (
        <section className='space-y-4'>
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
      {/*   <div className='fixed h-full w-full top-0 left-0 right-0 bg-black/50 z-50 flex justify-center items-center'>
            <form className='bg-gray-800'>
                <div>
                    <label htmlFor="">Amout</label>
                    <input type="text" className=' bg-blue-100 p-2 pl-4 rounded-[11px]' placeholder='Enter amount to withdraw' />
                </div>
            </form>
        </div> */}
       </section>
  )
}

export default Withdraw