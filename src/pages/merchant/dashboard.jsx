import React, { useEffect, useState } from 'react'
import { FiDollarSign, FiSearch } from 'react-icons/fi'
import "./scroll.css"
import { VAULT_CONTRACT, FACTORY_VAULT } from '../../contracts/contracts'
import { useReadContract } from 'wagmi'
import { useAccount } from 'wagmi'
import { useWriteContract } from 'wagmi';
import { watchContractEvent } from 'wagmi/actions';
import lynkXData from '../../service/axios'
import DashboardModal from './dashboardModal'



const Dashboard = () => {
  //console.log("myChains:", config.chains.map((chain) => chain))

  const {address, isConnected} = useAccount();

  const [modal, setModal] = useState(false);
  const [wallets, setWallets] = useState([]);
  const [balances, setBalances] = useState({});
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [reLogin, setReLogin] = useState(false)
  const [balanceLoading, setBalanceLoading] = useState(false)


 /*    const { writeContract: writeFactory, isPending: pendingFactory } = useWriteContract();

    const handleCreateVault = () => {
    writeFactory({
      ...FACTORY_VAULT,
      functionName: 'createVault',
      args: [1],
    });
  }; */
 // or viem if not using wagmi
  const getAllUserWallet = async () => {
    if (!address) return; // avoid calling API without address
    try {
      
      const res = await lynkXData.get(`/getUserAddresses/${address}`);
      //console.log("Fetching wallets for:", res.data.wallets);
      if (res.status === 200) setLoading(false)
      const data = res.data?.wallets
    console.log(data)
    if (res.data?.wallets) {
        setWallets(res.data?.wallets);
      }
    if (data === undefined) {
      setReLogin(true)
    }


     // <- use res.data
      
      
    } catch (err) {
      //console.error("Error fetching wallets:", err);
      if (err) {
        setLoading(false)
        setError(err)
      }
    }
  };


  useEffect(() => {
  if (!wallets) return;

  const getWalletBalance = async () => {
    setBalanceLoading(true);
    try {
        const results = await Promise.all(
      wallets.map(async (w) => {
        const res = await lynkXData.get(`/get-wallet-address/${w.id}`);
        setBalanceLoading(false)
        return {
          id: w.id,
          balance: res?.data?.walletBalance ?? [],
        };
      })
    );
     const newBalances = {};
    for (const r of results) {
      newBalances[r.id] = r.balance;
    }
    setBalances(newBalances);
    } catch (err) {
      setBalanceLoading(false)
      console.log("err:", err)
    }
  
    
  };

  // Fetch immediately and then every 5 seconds
  getWalletBalance();
  const interval = setInterval(getWalletBalance, 5000);
  return () => clearInterval(interval);
}, [wallets]);



  useEffect(() => {
    if (isConnected && address) {
      getAllUserWallet();
    }
  }, [isConnected, address]); // <- add dependencies
 

  return (
    /*  <p onClick={handleCreateVault}>create</p> */

    <section className='flex flex-col gap-3 text-[#D9D9D9] overflow-y-auto h-[88vh] scroll-invisible my-4'>
      <div className='w-full flex justify-end'>
        <button type='button' className='bg-[#B0B0B0] rounded-[7px] text-[#292C31] py-1 px-4 cursor-pointer w-fit' onClick={() => setModal(true)}>Create Vault</button>
        
      </div> 
     {/*  <p onClick={handleCreateVault}>create</p>
      <div className='border-dashed border-2 border-[#585858] py-2 px-2 justify-center text-[18px] italic flex'>
        
      </div> */}
      <div className='flex gap-4 w-full flex-wrap'>
        {loading && !error && <p className='w-full text-center'> Loading...</p>}
        {!loading && reLogin && <p className='w-full text-center'>Sign in timeout, log in again to restart</p>}
        {!loading && wallets.length === 0 && <p className='w-full text-600/50 text-center text-[21px] font-bold pt-10'>Welcome to LynkX, go ahead and create wallet to get started</p>}
        {Array.isArray(wallets) && wallets.length > 0 && wallets.map((wallet, index) => (
          <li className='bg-[#3F4246] rounded-[20px] list-none flex flex-col gap-2 items-center w-[310px] h-[160px] pt-5 pb-1 px-4' key={index}>
            <span className='flex justify-between w-full '>Wallet Name: <span>{wallet?.walletName?.toUpperCase()}</span></span>
           
            <span className='w-full flex flex-col'>
              {/* {balanceLoading && <p className='text-center pt-4'>Balance Loading...</p>} */}
              {balances[wallet.id]?.map((balance, index) => (
                <div className='flex w-full justify-between py-2' key={index}>
                  
                   {balance.length === 0  ? <p>0 BALANCE</p> : (<p className='flex w-full justify-between'><span>Amount</span> {balance.amount ? `${balance.amount} ${balance.token.symbol}` : "0"} </p>)}
                </div>
                
              ))}
            </span>
            
            {/* <div className='flex '>
              <button>Withraw</button>
              <button>gg:{factoryData}</button>
            </div> */}
          </li>
        ))

        }
        {/* <li className='bg-[#3F4246] rounded-[20px] list-none flex flex-col gap-2 items-center w-[310px] h-[160px] justify-center' >
            <span></span>
            <span></span>
            <div className='flex '>
              <button></button>
            </div>
        </li> */}
      </div>


      {/* pop up */}
      <DashboardModal modal={modal} setModal={setModal} address={address}/>
    </section>
    
  )
}

export default Dashboard

