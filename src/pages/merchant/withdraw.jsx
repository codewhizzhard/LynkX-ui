import React, { useEffect, useState } from 'react'
import { FiArrowDown, FiArrowUp, FiDollarSign } from 'react-icons/fi';
import { useAccount } from 'wagmi'
import lynkXData from '../../service/axios';
import {z} from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { setBalance } from 'viem/actions';


const Withdraw = () => {

    const {address, isConnected} = useAccount();
    const [wallets, setWallets] = useState([]);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [chains, setChains] = useState([]);
    const [selectedChain, setSelectedChain] = useState("");
    const [openChainSelection, setOpenChainSelection] = useState(false);

    const to = isConnected && address;
    const [option, setOption] = useState("send")
    const transferSchema = z.object({
        address: z
            .string()
            .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid address"),
        amount: z.string().min(1, "Amount is required"),
        chain: z.string().min(1, "required")
    });

     const {register, handleSubmit, setValue, formState: {isSubmitting, errors}} = useForm({
            resolver: zodResolver(transferSchema)
        })
        const handleSelect = async(option) => {
            console.log("op:", option)
            setSelected(option)
            setOpen(false) 
            setSelectedChain("")
            const response = await lynkXData.get(`/get-wallet-address/${option.id}`)
            console.log("respos:", response)
            if (response.status === 200) {
            setChains(response.data.walletBalance)
            console.log("balance:", response.data.walletBalance)

            }
           /*  balances[w.id] = response?.data?.walletBalance ?? 0
            
            setBalances(balances); */
        }

     const getAllUserWallet = async () => {
        if (!address) return; // avoid calling API without address
        try {
          console.log("Fetching wallets for:", address);
          const res = await lynkXData.get(`/getUserAddresses/${address}`);
          //const wallet = res
          //console.log("res:", res.data.wallets[0])
          if (res?.status === 200) {
            setWallets(res?.data?.wallets);
            setSelected(res?.data?.wallets[0]);
            handleSelect(res.data.wallets[0])
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
        // <- add dependencies
        

        const handleTransfer = async (data) => {
            console.log(data)
            
           try {
                const tokens = await lynkXData.get(`/get-wallet-address/${selected.id}`)
                if (tokens.status === 200) {
                    const token = tokens.data?.walletBalance.find((tk) => tk.token.symbol === data.chain)
                    console.log(typeof data.amount, data.address, token.token.id, selected.id, selected.blockchain)
                    const res = await lynkXData.post("/send-transaction", {amount: data.amount, destinationAddress: data.address, tokenId: token.token.id , walletId: selected.id, blockchain: selected.blockchain})
                    alert(`Transaction ${res?.data?.data?.state}`)
                } 
                
            } catch (err) {
                console.log("err:", err)
            }
        }

         const handlePickchain = (data) => {
           setValue("chain", data)
        }

    return (
      <section className=' flex flex-col text-[#B0B0B0]'>
        <span className='border-dashed border-2 border-[#585858] py-1 px-2 justify-center text-[18px] italic flex text-white'>
            Send to other address, or withraw to connected address
        </span>
        <div className='flex-grow h-[75vh] pt-3 flex justify-center'>
            <form className='w-[80%] h-[90%] bg-[#202225] rounded-[30px] p-2 text-[#292C31] flex items-center  flex-col gap-2' onSubmit={handleSubmit(handleTransfer)}>
                <div className='w-[40%] bg-[#292C31] rounded-[10px] flex justify-center cursor-pointer mt-1'>
                    <span className={`rounded-[7px] text-[16px] font-semibold text-white  px-10 py-2 bg-[#009FBD]`} >Send</span>
                    {/* <span className={`rounded-[7px] text-[16px] font-semibold text-white  px-8 py-2 ${option === "withdraw" ? "bg-[#009FBD]" : ""}`} onClick={() => setOption("withdraw")}>Withdraw</span> */}
                </div>
                {!selected && <p className='text-white text-2xl p-4 '>Loading wallets data...</p>}
                {
                     selected && (
                        
                        <div className='w-[60%] flex flex-col gap-2'>
                            <div className='flex gap-2 items-center'>
                                <div className='flex flex-col gap-2'>
                                <span className='text-[#B0B0B0] font-semibold text-[16px]'>From</span>
                                <div className="relative w-full">
                            {/* Selected wallet */}
                            <div className='flex justify-between bg-[#B0B0B0] rounded-[10px] py-2 px-3 cursor-pointer border border-[#009FBD] items-center gap-2' onClick={() => setOpen(!open)}>
                                <div
                                
                                className=" flex flex-col gap-1"
                            >
                                <span className="font-semibold">
                                {selected?.walletName.toUpperCase() }
                                </span>
                                <span className="font-semibold">
                                {selected?.address}
                                </span>
                            </div>
                            {open ? <FiArrowUp className='text-2xl flex items-end mt-5'/> : <FiArrowDown className='text-2xl flex items-end mt-5'/>}
                            </div>
                            

                            {/* Dropdown list */}
                            {open && wallets &&  (
                                <div className="absolute mt-2 w-full bg-white rounded-[10px] shadow-lg z-10 ">
                                {wallets?.length > 0 && wallets.map((wallet, i) => (
                                    <div
                                    key={i}
                                    onClick={() => handleSelect(wallet)}
                                    className="px-3 py-2 bg-gray-100 cursor-pointer border-[#009FBD] border"
                                    >
                                    <div className="font-bold">{wallet.walletName.toUpperCase() || "Unnamed"}</div>
                                    <div className="text-sm text-gray-500">
                                        {wallet.address}
                                    </div>
                                    
                                    </div>
                                ))}
                                </div>
                            )}
                            </div>
                            
                            </div>
                            <div className='flex flex-col relative h-full items-start'>
                                <p className='text-red-500 text-[12px] w-[50%] flex justify-start mt-0 h-[3vh] mb-4'>{errors?.chain && errors.chain?.message}</p>
                                <button  className='text-[#B0B0B0] flex justify-between items-center border-4 border-[#009FBD] w-[12vw] cursor-pointer text-center px-1' type='button' onClick={() => setOpenChainSelection((prev) => !prev)}>{selectedChain ? selectedChain : "Pick chain" }<FiArrowDown /></button>
                                {chains.length > 0 && openChainSelection && (<ul className='flex flex-col gap-1 absolute top-17 w-full z-50 cursor-pointer' >{chains.map((chain, index) => (
                                    <li className=' pl-1 bg-[#B0B0B0] z-50' key={index} onClick={() => {handlePickchain(chain.token.symbol); setOpenChainSelection((prev) => !prev); setSelectedChain(chain.token.symbol)}}>{chain.token.symbol.toUpperCase()}</li>
                                ) )} </ul>)}
                            </div>
                            



                              {/* <div>
                                <p className='text-[#B0B0B0] flex gap-1 items-center border border-[#009FBD] w-[8vw]' onClick={setOpenChainSelection((prev) => !prev)}>Pick chain <FiArrowDown /></p>
                                {chains.length > 0 && openChainSelection && <span className='flex flex-col gap-2'>{ chains.map((chain, index) => <span className='bg-red-600 text-white' key={index}>{chain.token.symbol.toUpperCase()}</span>)}</span>}
                            </div>   */}
                        </div>
                            
                            <div className='flex flex-col gap-2'>
                                <span className='text-[#B0B0B0] font-semibold text-[16px]'>To</span>
                                <input type="text" placeholder='place address here' className='bg-[#B0B0B0] text-[#292C31] rounded-[10px] py-3 w-full px-3 outline-none border border-[#009FBD]' {...register("address")}/>
                                {errors?.address && <p className='text-red-500 text-[12px] w-[50%] flex justify-start mt-0'>{errors.address?.message}</p>} 
                            </div>
                            <div className='flex justify-between items-end h-[15vh]'>
                                <div className='flex flex-col gap-2 w-[50%]'>
                                    {/* <span className='text-[#B0B0B0] font-semibold text-[16px]'>Amount</span> */}
                                     {errors?.amount && <p className='text-red-500 text-[12px] w-[50%] flex justify-start mt-0'>{errors.amount?.message}</p>} 
                                     <div>
                                       
                                        <input type="text" className='bg-[#B0B0B0] text-[#292C31] rounded-[10px] py-3 w-full px-3 outline-none border border-[#009FBD]' placeholder='amount' {...register("amount")}/></div>
                                </div>
                                <button type='submit' className='w-[45%] bg-[#009FBD] h-[58%]  rounded-[11px]'>Confirm</button>
                            </div>
                        </div>
                    )
                }
                {
                    /* option === "withdraw" && (
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
                    ) */
                }
                <button type='submit'>Confirm</button>
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