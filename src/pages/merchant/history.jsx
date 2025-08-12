import React, { useEffect, useState } from 'react'
import "./scroll.css"
import lynkXData from '../../service/axios';
import { useAccount } from 'wagmi';
import { FiDollarSign } from 'react-icons/fi';

const History = () => {

    const {address, isConnected} = useAccount();

    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(false)

    const timeFormat = (timestamp) => {
        const now = new Date();
        const created = new Date(timestamp)

        const dfMs = now - created;
        const diffSecs = Math.floor(dfMs / 1000)
        const diffMins = Math.floor(diffSecs / 60)
        const diffHrs = Math.floor(diffMins / 60)
        const diffDays = Math.floor(diffHrs / 24)

        if (diffSecs < 60) return `${diffSecs}s ago`;
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHrs < 24) return `${diffHrs}h ago`;
        return `${diffDays}d ago`;
    }

    const getTransactions = async () => {
         if (!address) return; // avoid calling API without address
         setLoading(true)
            try {
              console.log("Fetching wallets for:", address);
              const res = await lynkXData.get(`/getUserAddresses/${address}`);
              console.log("Wallets:", res.data?.wallets); // <- use res.data
              if (res.data?.wallets) {
                //setWallets(res.data?.wallets);
                const ids = res.data?.wallets.map((_id) => _id.id)
                const histories = await lynkXData.get("/get-transactions")//
                if (histories?.status === 200) {
                    setLoading(false)
                    let displayHistory = histories.data?.data.filter((history) => ids.includes(history.walletId))
                    displayHistory = displayHistory.map((dh) => ({...dh, age: timeFormat(dh.createDate)}));
                    setTransactions(displayHistory)
                    console.log("aff:", displayHistory)
                }}
              
            } catch (err) {
                setLoading(false)
              console.error("Error fetching wallets:", err);
            }
        }

    useEffect(() => {
        getTransactions()
    }, [])


  return (
    <section className=' flex flex-col text-[#B0B0B0] gap-8'>
        <span className='border-dashed border-2 border-[#585858] py-1 px-2 justify-center text-[18px] italic flex'>
            History
        </span>
        <div className='flex flex-col'>
            <ul className='flex bg-[#202225] text-[17px] font-semibold p-3'>
                <li className='flex-2/5'>Transaction Hash</li>
                <li className='flex-2/5'>From</li>
                <li className='flex-2/5'>To</li>
                <li className='flex-1/5'>Age</li>
                <li className='flex-1/5'>Amount</li>
            </ul>
            <ul className='overflow-y-scroll h-[52vh] scroll-invisible'>
                {transactions.length === 0 && !loading  && <p className='text-white text-2xl p-4 w-full text-center'>No data to display</p>}
                {loading && <p className='text-white text-2xl p-4 w-full text-center'>Loading history...</p>}
               
                {transactions.length > 0 && transactions.map((transaction, index) => (
                    <li className='flex bg-[#292C31] text-[17px] font-semibold p-3 border-y border-[#B0B0B0] gap-2' key={index}>
                    <span className='flex-2/5 truncate'>{transaction.txHash?.slice(0,6)+ "..." + transaction.txHash?.slice(-6)}</span>
                    <span className='flex-2/5 truncate'>{transaction.sourceAddress?.slice(0,6)+ "..." + transaction.sourceAddress?.slice(-6)}</span>
                    <span className='flex-2/5 truncate'>{transaction.destinationAddress?.slice(0,6)+ "..." + transaction.destinationAddress?.slice(-6)}</span>
                    <span className='flex-1/5 truncate'>{transaction.age}</span>
                    <span className='flex-1/5 truncate flex items-center gap-[1px]'><FiDollarSign className='mt-[2px]'/>{transaction.amounts?.[0]}</span>
                     </li>
                ))
            }
           
            </ul>
        </div>
    </section>
  )
}

export default History