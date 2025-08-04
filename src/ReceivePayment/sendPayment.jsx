import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import lynkXData from '../service/axios'
import { FiArrowDown, FiArrowLeft, FiArrowUp, FiFastForward } from 'react-icons/fi'
import bg from "../assets/landingPage/bg.png"
import logo from "../assets/landingPage/logo.png"
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import stbObject from "../assets/landingPage/stbObject.png";

const SendPayment = () => {
    const { id } = useParams()

    
    const {address, isConnected} = useAccount();

    const [paymentDetails, setPaymentDetails] = useState(null);
    const [cctpv2Option, setCctpv2Option] = useState("");
    const [sourceChain, setSourceChain] = useState("");
    const [dropDown, setDropDown] = useState(false);
    const [loading, setLoading] = useState(true);

    const getParticularPaymentDetails = async() => {
        if (!id) return <p>Invalid path</p>
        try {
            const res = await lynkXData.get(`/get-payment-info/${id}`);
            if (res.status === 200) {
                setLoading(false)
                console.log("paymengt:", res.data?.payment);
                setPaymentDetails(res.data?.payment)
            }
        } catch (err) {
            console.log("err:", err);
            if (err.status === 400) setLoading(false)
        }
    }
    useEffect(() => {
        getParticularPaymentDetails()
    }, [id])

     const chainNameMap = {
        'Ethereum Sepolia': 'ETH-SEPOLIA',
        Ethereum: 'ETH-MAINNET',
        Polygon: 'MATIC-POLYGON',
        Optimism: 'ETH-OPTIMISM',
        Arbitrum: 'ETH-ARBITRUM',
        Base: 'BASE-SEPOLIA'
     };

     const handleSourceChain = (value) => {
        setSourceChain(value); 
        setDropDown(false)
        if (value !== paymentDetails.token.chain) {
            setCctpv2Option("fast")
        }
     }

     const handleChangeCctpv2Option = (option) => {
        if (sourceChain === paymentDetails.token.chain) return setCctpv2Option("")
        setCctpv2Option(option)
     }
     /* useEffect(() => {
        setCctpv2Option("")
     }, sourceChain) */

  return (
    <div className='w-full h-[100vh]'>
        {!paymentDetails && !loading && <div className='w-full h-full bg-red-300/90 flex justify-center items-center text-9xl flex-col gap-4'>404 Not Found <Link to={"/"} className='text-4xl flex gaLink to={"}-[1px] items-center underline text-[#009FBD]'><FiArrowLeft className='pt-2 text-5xl text-white'/>HOME</Link></div>}
        {!paymentDetails && loading && <div className='h-full w-full bg-[#009FBD] text-9xl text-[#B0B0B0] flex justify-center items-center'>Loading...</div>}

        {paymentDetails &&  (
               <div style={{backgroundImage: `url(${bg})`, backgroundSize: 'cover', fontFamily: 'ABeeZee, sans-serif' }} className='text-white min-h-[100vh]  px-12 py-6'>
                    <header className='flex justify-between items-center px-2'>
                        <Link className='flex items-center gap-4' to={"/"}>
                            <div className='h-[39px] w-[24px]'>
                                <img src={logo} alt="logo" className='object-cover w-full'/>
                            </div>
                            <h1 className='font-bold text-2xl italic'>LynkX</h1>
                        </Link>
                        <div className='flex gap-8'>
                            <Link className={`text-[18px] pt-2 italic cursor-pointer font-semibold`} to={"/about"}>About</Link>
                          {/*   <Link to={"/roles"} className={`text-[18px] pt-2 italic cursor-pointer font-semibold ${locate.pathname === "/roles" ? "text-[#009FBD]" : ""}`} >Roles</Link> */}
                            <span>{address ? <p className='text-[18px] mt-[6px] italic border-2 border-[#009FBD] rounded-[10px] px-4 font-semibold'>{`${address.slice(0,3)}...${address.slice(-3)}`}</p> : <ConnectButton />}</span>
                        </div>
                    </header>

                     <main className='mt-15 flex justify-between '>
                            <div className='w-full flex flex-col gap-8 mt-15'>
                                <div className='flex justify-between bg-[#D9D9D9] p-1 cursor-pointer'><button className={`w-[48%] ${cctpv2Option === "fast" ? "bg-purple-500" : ""} text-center rounded-[5px] cursor-pointer p-1`} type='button' onClick={() => handleChangeCctpv2Option("fast")}>Fast Transfer 🚀</button><button className={`w-[48%] ${cctpv2Option === "standard" ? "bg-purple-500" : ""} text-center rounded-[5px] cursor-pointer p-1`} type='button' onClick={() => handleChangeCctpv2Option("standard")}>Standard Transfer 🛡️</button></div>
                                <div className='flex gap-2 justify-between w-full'>
                                    <div className='flex flex-col w-[48%] '>
                                        <label htmlFor="" className='text-[14px]'>Destination Chain:</label>
                                        <input type="text" defaultValue={paymentDetails.token.chain.toUpperCase()} className='bg-[#D9D9D9] p-2 pl-3 rounded-[6px] outline-none text-black'/>
                                    </div>
                                    <div className='flex flex-col w-[48%] relative'>
                                        <label htmlFor="" className='text-[14px]'>Source Chain:</label>
                                        <div className='bg-[#D9D9D9] p-2 pl-3 rounded-[6px]  text-black flex justify-between items-center cursor-pointer' onClick={() => setDropDown((prev) => !prev)}>{sourceChain ? sourceChain : "pick a chain"} {dropDown ? <FiArrowUp /> : <FiArrowDown /> }</div>
                                        {dropDown && (
                                            <ul className='w-full absolute  top-16 flex flex-col gap-1 bg-black/85 rounded-[11px]'>
                                                {Object.entries(chainNameMap).map(([key, value]) => <li key={value} className=' cursor-pointer border-2 border-[#D9D9D9] p-1 pl-3' onClick={() => handleSourceChain(value)}>
                                                    {value}
                                                </li>)}
                                            </ul>
                                        )}
                                        {/* <input type="text"  className='bg-[#D9D9D9] p-2 pl-3 rounded-[6px] outline-none text-black' /> */}
                                    </div>

                                </div>
                                <div className='flex gap-2 justify-between w-full'>
                                    <div className='flex flex-col w-[48%] '>
                                        <label htmlFor="" className='text-[14px]'>Amount(USDC):</label>
                                        <input type="text"  className='bg-[#D9D9D9] p-2 pl-3 rounded-[6px] outline-none text-black ' defaultValue={`$${paymentDetails.amount.$numberDecimal}`}/>
                                    </div>
                                    <div className='w-[48%] flex items-end h-full'>
                                        <button className='w-full bg-red-600 rounded-[9px] h-[67%] items-end cursor-pointer'>Send</button>
                                    </div>
                                </div>
                                
                                
                            </div>



                            <div className='min-w-[50%] justify-end flex pl-6'>
                                <img src={stbObject} alt="biggerLogo" className='h-[347px] w-[370px] '/>
                            </div>
                            </main>
                </div>        
        )}
       
    </div>
  )
}

export default SendPayment