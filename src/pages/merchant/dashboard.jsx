import React, { useEffect, useState } from 'react'
import { FiDollarSign, FiSearch } from 'react-icons/fi'
import "./scroll.css"
import { VAULT_CONTRACT, FACTORY_VAULT } from '../../contracts/contracts'
import { useReadContract } from 'wagmi'
import { useAccount } from 'wagmi'
import { useWriteContract } from 'wagmi';
import { watchContractEvent } from 'wagmi/actions';
import { config } from '../../wagmiConfig'
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
    if (!wallets) return 
    const getWalletBalance = async() => {
        for (const w of wallets) {
        const res = await lynkXData.get(`/get-wallet-address/${w.id}`)
        console.log("balance:", res?.data?.walletBalance)
        balances[w.id] = res?.data?.walletBalance ?? 0
    }
    setBalances(balances);
    }
   const interval = setInterval(getWalletBalance, 600000);
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
            <span className='truncate max-w-[290px]'>{wallet?.address}</span>
            <span className='flex gap-4'>Wallet balance: <span>{!balances[wallet?.id] && "0" }</span></span>
            
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

/* <section className='flex h-full gap-4'>

      <div className='flex-grow flex flex-col gap-6'>
        <div className='justify-between flex'>
          <h2 className='text-[18px] font-bold text-center text-blue-500'>Dashboard</h2>
          <div className='w-[60%] flex justify-end relative bg-blue-100 rounded-[6px] py-1'><input type="text" className='outline-none  p-1   w-[93%]' placeholder='search'/> <FiSearch className='absolute top-3 left-2 text-[18px]'/></div>
        </div>
        <div className='flex gap-4'>

          <span className='flex flex-col w-full bg-gray-800/65 p-4 rounded-[30px] h-[150px] text-[16px] font-semibold gap-2'>
            <div className='flex justify-between'>
              <span className='flex items-center'>
                <FiDollarSign className='justify-start '/>
                <p>Balance</p>
              </span>
              <span className='px-2 bg-green-300 rounded-[8px] text-center'>17%</span>
            </div>
            <div className='font-bold text-2xl'>$100000</div>
            <div>Chart</div>
          </span>
          <span className='flex flex-col w-full bg-gray-800/65 p-4 rounded-[30px] h-[150px] text-[16px] font-semibold gap-2'>
            <div className='flex justify-between'>
              <span className='flex items-center'>
                <FiDollarSign className='justify-start '/>
                <p>Balance</p>
              </span>
              <span className='px-2 bg-green-300 rounded-[8px] text-center'>17%</span>
            </div>
            <div className='font-bold text-2xl'>$100000</div>
            <div>Chart</div>
          </span>
          <span className='flex flex-col w-full bg-gray-800/65 p-4 rounded-[30px] h-[150px] text-[16px] font-semibold gap-2'>
            <div className='flex justify-between'>
              <span className='flex items-center'>
                <FiDollarSign className='justify-start '/>
                <p>Balance</p>
              </span>
              <span className='px-2 bg-green-300 rounded-[8px] text-center'>17%</span>
            </div>
            <div className='font-bold text-2xl'>$100000</div>
            <div>Chart</div>
          </span>
        </div>

        <div>
          Chart
        </div>

        <div>
          <span className='flex justify-between '>
            <h3>Orders</h3>
            <button type="button">View All Orders</button>
          </span>
          <div className='flex'>
            <span className='flex-2/3'>h</span>
            <span className='flex-1/3'>h</span>
            <span className='flex-1/3'>h</span>
          </div>
        </div>


      </div>

      <div className='w-[30%] flex flex-col bg-gray-800 h-full text-white gap-6 p-2'>
        <div>
          <h2>Data overview</h2>
          <div className='flex'>
            <div>
              statictics
            </div>
            <div className='flex flex-col'>
              <span>
                <p>hhh</p>
              </span>
              <span>
                <p>hhh</p>
              </span>
            </div>
          </div>
        </div>

        <div>
          <span className='flex justify-between'>
            <h2>Recent Sales</h2>
            <p>see all</p>
          </span>
          
          <span>Sales</span>
        </div>
      </div>
    </section> */