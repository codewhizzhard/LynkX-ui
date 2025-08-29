import React, { useState } from 'react'
import lynkXData from '../../service/axios';
import { useEffect } from 'react';
import { avalanche } from 'viem/chains';

const DashboardModal = ({modal, setModal, address, wallets}) => {

    const [walletName, setWalletName] = useState("")
    const [blockchains, setBlockchains] = useState(["ETH-SEPOLIA"])
    const [loading, setLoading] = useState(false)

     const chainNameMap = {
        'Ethereum Sepolia': 'ETH-SEPOLIA',
        Polygon: 'MATIC-AMOY',
        Base: 'BASE-SEPOLIA',
        Avalanche: "AVAX-FUJI"
     };

     

     const handleChange = (e) => {
        e.preventDefault();
        const value = e.target.value
        setBlockchains([value])
        //console.log("bbblock:", value)
     }
    
     const handleCreate = async () => {
      setLoading(true)
        if (!Array.isArray(blockchains) || blockchains.length === 0 || !address || !walletName) console.log("ff")
        try {
            //console.log(address, blockchains, walletName)
            const res = await lynkXData.post("/create-wallets", {address, blockchains, walletName})
            //console.log("wallet created:", res?.data?.user)// res.data.user.wallets
            if (res.status === 201) {
              setLoading(false)
              alert("Wallet created");
              setModal(false)
              window.location.reload()
            }
        } catch (err) {
            console.log("err:", err)
            setLoading(false)
        }

     }

  return (
    <div>
      {modal &&
      <div className='fixed top-0 w-full bg-black/90 left-0 right-0 h-full flex justify-center items-center flex-col '>
      <div className='w-[50%] bg-[#009FBD]/50 flex flex-col gap-4 px-10 rounded-[30px] h-[60%] justify-center'>
      {wallets.length >= 4  ? <p className='text-center text-red-500'>You have reached the maximum number of wallets allowed (4).</p> : <>
        <div className='flex flex-col gap-3'>
          <label htmlFor="" >Wallet Name</label>
          <input type="text" placeholder='walletName' className='p-2 bg-[#D9D9D9] outline-none rounded-[7px] text-black' value={walletName} onChange={(e) => setWalletName(e.target.value)}/>
        </div>
        <div className='flex flex-col'>
          <label for="chain" className="block mb-2 text-sm font-medium text-gray-200">Select Chain</label>
          <select  className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg focus:ring-[#009FBD] focus:border-[#009FBD] block p-3 mb-10" defaultValue={"ETH-SEPOLIA"} value={blockchains} onChange={handleChange}>
             {Object.entries(chainNameMap).map(([displayName, value]) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
            </select>
        </div>  </>}
        {loading &&<p>Loading</p>} 
        <div className='flex justify-between'>
          <button type='button' className='py-3 px-6 rounded-[7px] bg-red-500/60 cursor-pointer' onClick={() => setModal(false)}>Cancel</button>
         {wallets.length < 4 && <button type='button' className='py-3 px-6 rounded-[7px] bg-green-400/60 cursor-pointer' onClick={handleCreate} disabled={loading}>Create</button>}
        </div>
        

      </div>
      

      </div>
}
      </div>
  )
}

export default DashboardModal