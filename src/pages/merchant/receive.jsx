import React, { useState } from 'react'
import { form } from 'viem/chains'

const Receive = () => {

    const [showLinkArea, setShowLinkArea] = useState(false);
    const [showLink, setShowLink] = useState(false);
    
    const handleGenerate = () => {
        setShowLink(true);
    }
  return (
    <section className='space-y-8 pt-4'>
        <h2 className='text-[18px] font-bold text-center text-blue-500'>RECEIVE</h2>
        <p className='text-red-500 text-center text-[15px] font-semibold'>You can either generate a link to get usdc from any chain with circle cctp v2 or just copy and send your address to the sender which should strictly send usdc to your created chain on the platform</p>
        <div>
            <span></span>
            <p></p>
            <span></span>
        </div>
        <div className='flex items-center w-full justify-center'>
            {!showLinkArea &&<button className='text-white font-semibold text-[16px] cursor-pointer bg-blue-500 p-4 rounded-[11px] ' type='button' onClick={() => setShowLinkArea(true)}>Generate Link</button>}
            { showLinkArea && (
                <form className='border-2 border-blue-500 w-[60%] space-y-4 p-3 rounded-[11px] text-gray-800'>
                    <h3 className='text-[15px] font-bold text-center'>Generate Link</h3>
                    <div className='flex flex-col space-y-2'>
                        <label htmlFor="" className='text-[14px] font-semibold'>Order Id</label>
                        <input type="text" className='outline-none bg-blue-100 p-2 rounded-[11px]' placeholder='#246'/>
                    </div>
                    <div className='flex flex-col space-y-2'>
                        <label htmlFor="" className='text-[14px] font-semibold'>Product Name</label>
                        <input type="text" className='outline-none bg-blue-100 p-2 rounded-[11px]' placeholder='adidas adilette'/>
                    </div>
                    <div className='flex flex-col space-y-2'>
                        <label htmlFor="" className='text-[14px] font-semibold'>Amount To Receive</label>
                        <input type="text" className='outline-none bg-blue-100 p-2 rounded-[11px]' placeholder='$400'/>
                    </div>
                    {showLink &&
                        <div>
                            <p>Link successfully created</p>
                            <span>
                                #eueoencl893bAdidi229
                            </span>
                            <span>copy</span>
                        </div>}
                    <div className='flex justify-between'>
                        <button className='text-red-500 bg-blue-100 p-4 rounded-[11px] text-[16px] font-semibold cursor-pointer' type='button' onClick={() => setShowLinkArea(false)}>Cancel</button>
                        <button className='text-white bg-blue-500 p-4 rounded-[11px] text-[16px] font-semibold cursor-pointer' type='button'onClick={handleGenerate}>Generate</button>
                    </div>
                </form>
            )
                
                
            }
        </div>
    </section>
  )
}

export default Receive