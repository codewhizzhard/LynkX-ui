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

  const vaults = [ {vaultName: "name", vaultAmount: "20000"}, {vaultName: "name", vaultAmount: "20000"},]

    const { writeContract: writeFactory, isPending: pendingFactory } = useWriteContract();

    const handleCreateVault = () => {
    writeFactory({
      ...FACTORY_VAULT,
      functionName: 'createVault',
      args: [1],
    });
  };
 // or viem if not using wagmi
  const getAllUserWallet = async () => {
    if (!address) return; // avoid calling API without address
    try {
      console.log("Fetching wallets for:", address);
      const res = await lynkXData.get(`/getUserAddresses/${address}`);
      console.log("Wallets:", res.data?.wallets); // <- use res.data
      if (res.data?.wallets) {
        setWallets(res.data?.wallets);
      }
      
    } catch (err) {
      console.error("Error fetching wallets:", err);
    }
  };


  useEffect(() => {
    //get wallet balance
    if (!wallets) return 
    const getWalletBalance = async() => {
        for (const w of wallets) {
        const res = await lynkXData.get(`/get-wallet-address/${w.id}`)
        balances[w.id] = res?.data?.walletBalance ?? 0
        console.log("balan:", balances[w.id])
        setBalances(balances);
    }
    
    
    }
   const interval = setInterval(getWalletBalance, 5000);
   return () => clearInterval(interval);
  }, [wallets])


  useEffect(() => {
    if (isConnected && address) {
      getAllUserWallet();
    }
  }, [isConnected, address]); // <- add dependencies


/* useEffect(() => {
  const unwatch = watchContractEvent({
    address: FACTORY_VAULT.address,
    abi: FACTORY_VAULT.abi,
    eventName: 'vaultCreated',
    listener(logs) {
      console.log("Vault created:", logs);
    },
  }); 

  return () => unwatch(); // cleanup
}, []); */

  /* console.log("vault:", handleCreateVault()) */

  const {data: factoryData} = useReadContract({
    ...FACTORY_VAULT,
    functionName: "getVaultAddresses",
    args: [address]
  })

 

  return (
    /*  <p onClick={handleCreateVault}>create</p> */

    <section className='flex flex-col gap-3 text-[#D9D9D9] overflow-y-hidden'>
      <div className='w-full flex justify-end'>
        <button type='button' className='bg-[#B0B0B0] rounded-[7px] text-[#292C31] py-1 px-4 cursor-pointer w-fit' onClick={() => setModal(true)}>Create Vault</button>
        
      </div> 
     {/*  <p onClick={handleCreateVault}>create</p>
      <div className='border-dashed border-2 border-[#585858] py-2 px-2 justify-center text-[18px] italic flex'>
        
      </div> */}
      <div className='flex gap-4  w-full flex-wrap'>
        {Array.isArray(wallets) && wallets.length > 0 && wallets.map((wallet, index) => (
          <li className='bg-[#3F4246] rounded-[20px] list-none flex flex-col gap-2 items-center w-[310px] h-[160px] justify-center' key={index}>
            <span className='flex gap-4'>Wallet Name: <span>{wallet?.walletName?.toUpperCase()}</span></span>
            <span className='flex gap-4'>Wallet Name: <span>{wallet?.blockchain?.toUpperCase()}</span></span>
            <span className=' max-w-[290px] truncate'>{wallet?.address}</span>
            <span className='flex gap-4'>Wallet balance: {balances[wallet.id]?.map((balance, index) => (
              <span key={index}>{balance?.amount ? balance.amount : 0}</span>
            ))}
            {/* {balances[wallet?.id]?.length === 0 ? "0" : balances[wallet?.id]?.map((balance, index) => (
              <span key={index}>{balance?.amount ? balance?.amount : "0"}</span>
            ))}</ */}</span>
            
            {/* <div className='flex '>
              <button>Withraw</button>
              <button>gg:{factoryData}</button>
            </div> */}
          </li>
        ))

        }
        <li className='bg-[#3F4246] rounded-[20px] list-none flex flex-col gap-2 items-center w-[310px] h-[160px] justify-center' >
            <span></span>
            <span></span>
            <div className='flex '>
              <button></button>
            </div>
        </li>
      </div>

      <div className='pt-3'>
        <div className='border-dashed border-2 border-[#585858] py-1 px-2 justify-center text-[14px] italic flex'>
        <p className='text-[#B0B0B0] rounded-[7px] px-4' >Vault History</p>
        </div>

        <div className='flex bg-[#202225] w-full px-3 py-2'>
        <span className='flex-1/4'>vaultName</span>
        <span className='flex-1/4'>hh hhhsyys gtddt</span>
        <span className='flex-1/4'>hhh hhsyys</span>
        <span className='flex-1/4 '>hh</span>
      </div>

        <div className='bg-[#292C31] overflow-y-auto h-34  scroll-invisible'   >

        
      <div className='flex px-3 py-2 border-y border-[#D9D9D9]'>
        <span className='flex-1/4'>hh</span>
        <span className='flex-1/4'>hh hhhsyys gtddt</span>
        <span className='flex-1/4'>hhhhhsyys gtddt</span>
        <span className='flex-1/4'>hh</span>
      </div>
      <div className='flex px-3 py-2 border-y border-[#D9D9D9]'>
        <span className='flex-1/4'>hh</span>
        <span className='flex-1/4'>hh hhhsyys gtddt</span>
        <span className='flex-1/4'>hhhhhsyys gtddt</span>
        <span className='flex-1/4'>hh</span>
      </div>
      <div className='flex px-3 py-2 border-y border-[#D9D9D9]'>
        <span className='flex-1/4'>hh</span>
        <span className='flex-1/4'>hh hhhsyys gtddt</span>
        <span className='flex-1/4'>hhhhhsyys gtddt</span>
        <span className='flex-1/4'>hh</span>
      </div>
      <div className='flex px-3 py-2 border-y border-[#D9D9D9]'>
        <span className='flex-1/4'>hh</span>
        <span className='flex-1/4'>hh hhhsyys gtddt</span>
        <span className='flex-1/4'>hhhhhsyys gtddt</span>
        <span className='flex-1/4'>hh</span>
      </div>
      <div className='flex px-3 py-2 border-y border-[#D9D9D9]'>
        <span className='flex-1/4'>hh</span>
        <span className='flex-1/4'>hh hhhsyys gtddt</span>
        <span className='flex-1/4'>hhhhhsyys gtddt</span>
        <span className='flex-1/4'>hh</span>
      </div>
      <div className='flex px-3 py-2 border-y border-[#D9D9D9]'>
        <span className='flex-1/4'>hh</span>
        <span className='flex-1/4'>hh hhhsyys gtddt</span>
        <span className='flex-1/4'>hhhhhsyys gtddt</span>
        <span className='flex-1/4'>hh</span>
      </div>
      

        </div>

    </div>
     


      {/* pop up */}
      <DashboardModal modal={modal} setModal={setModal} address={address}/>
    </section>
    
  )
}

export default Dashboard

