import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import lynkXData from '../service/axios'
import { FiArrowDown, FiArrowLeft, FiArrowUp, FiFastForward } from 'react-icons/fi'
import bg from "../assets/landingPage/bg.png"
import logo from "../assets/landingPage/logo.png"
//import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useChainId, useConnect, useDisconnect } from 'wagmi'
import stbObject from "../assets/landingPage/stbObject.png";
import cctpData from '../service/cctpAxios'
import { useApproveUSDC } from '../hooks/circleHooks/approve'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { USDC_CONTRACTS, circleContracts } from '../hooks/circleHooks/circledeployedContracts'
import { useDepositForBurn } from '../hooks/circleHooks/depositForBurn'
import { retrieveMsg } from '../hooks/circleHooks/retrieveMsg'
import { useMintUSDC } from '../hooks/circleHooks/mintUsdc'
import Web3 from "web3";



const SendPayment = () => {
    const web3 = new Web3(`https://sepolia.infura.io/v3/0e92b732d2c44995b03942276a10198c`);

    const { id } = useParams()

    const {approveUSDC, status, txHash, receipt} = useApproveUSDC()
    const {mintUSDC, status: mintStatus, txHash: mintTxHash, error} = useMintUSDC()

    const {address, isConnected} = useAccount();
    const { connect, connectors } = useConnect()
    const { disconnect } = useDisconnect()
    let chainId = useChainId()

    

    const [paymentDetails, setPaymentDetails] = useState(null);
    const [cctpv2Option, setCctpv2Option] = useState("");
    const [sourceChain, setSourceChain] = useState("");
    const [dropDown, setDropDown] = useState(false);
    const [loading, setLoading] = useState(true);
    const [errMessage, setErrMessage] = useState(false)
    const [transact, setTransact] = useState(false)

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

     const chainIdToName = {
        1: "ethereumMainnet",
        5: "goerli",
        11155111: "ethereumSepolia",
        137: "polygon",
        80001: "mumbai",
        80002: "polygonAmoy",
        10: "optimism",
        11155420: "opSepolia",
        42161: "arbitrumOne",
        421614: "arbitrumSepolia",
        8453: "baseMainnet",
        84532: "baseSepolia",
        43114: "avalanche",
        43113: "avalancheFuji",
        59144: "lineaMainnet",
        59141: "lineaSepolia",
     }

     const chainIdMap = {
        'ETH-SEPOLIA': 0,  // Ethereum Sepolia
        'BASE-SEPOLIA': 6, 
        "AVAX-FUJI": 1,
        "MATIC-AMOY": 7, 

          //'ETH-MAINNET': 1,            // Ethereum Mainnet
         // 'MATIC-POLYGON': 137,       // Polygon Mainnet
        // Base Sepolia (testnet)
        }
        const nameTochainMap = {
            'ETH-SEPOLIA': "ethereumSepolia",       // Arbitrum One Mainnet
            'BASE-SEPOLIA': "baseSepolia", 
            "AVAX-FUJI": "avalancheFuji",
            "MATIC-AMOY": "polygonAmoy",
        }
        
    
     const handleSourceChain = (value) => {
        setSourceChain(value); 
        setDropDown(false)
        if (value !== paymentDetails.token.chain) {
            setCctpv2Option("fast")
        } else {
            setCctpv2Option("")
        }
     }

    

     const handleChangeCctpv2Option = (option) => {
        if (sourceChain === paymentDetails.token.chain) return setCctpv2Option("")
        setCctpv2Option(option)
     }
     /* useEffect(() => {
        setCctpv2Option("")
     }, sourceChain) */
     
     const optionName = chainId && chainIdToName[chainId]

    const { depositForBurn, status: burnStatus, txHash: burnTxHash } = useDepositForBurn(circleContracts["TokenMessengerV2"][optionName])

  /*    const msg = {
    attestation: "0xf1e9123c762828e1cfe8663efb225022238a306dd35a53713b9b3c469f7a735d664852b0c7fa41f9c7188c112042ac3bfbe4f2f59a939de73bdb12fb8ff088561b2d4f965cd279c6b5dd6fc8000e5683ec752b8759024602f0e669f57b8da07dbf60fe6c7424fa49d107cbcc016332ca73422ecff2759b36a10a641b3d148786d21c",
    message: "0x000000010000000000000006a0c3b3c957b15fc43e00a189d879c8fbd7cbabfde05e252f5ab6f54a31af32530000000000000000000000008fe6b999dc680ccfdd5bf7eb0974218be2542daa0000000000000000000000008fe6b999dc680ccfdd5bf7eb0974218be2542daa0000000000000000000000000000000000000000000000000000000000000000000003e8000007d0000000010000000000000000000000001c7d4b196cb0c7b01d743fbc6116a902379c7238000000000000000000000000cab180b62d3cc891802e072af06197f012cce73600000000000000000000000000000000000000000000000000000000000f4240000000000000000000000000cab180b62d3cc891802e072af06197f012cce736000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
}
    const wok = async () => {
        const work = await mintUSDC({transmitterAddress: "0x7865fAfC2db2093669d92c0F33AeEF291086BEFD",
  attestation: msg,
})
    console.log("work:", work) */
    
     const handleSend = async() => {
        if (!isConnected) {
            const metamask = connectors.find(c => c.id === 'metaMask')
            if (metamask) connect({ connector: metamask })
        }
        setErrMessage(false)
        setTransact(true)
        const destinationDomainId = chainIdMap[paymentDetails?.token.chain.toUpperCase()]
        console.log("hhhhh:", paymentDetails?.token.chain)
       chainId = 0/* chainId === "11155111" ? 0 : "11155111"; */
        //console.log("ggg:", chainId)
        try {
            const sourceDomainId = chainId
            console.log("sourceDomainId", paymentDetails?.token.chain, nameTochainMap[paymentDetails?.token.chain])
            const tkMess = circleContracts["TokenMessengerV2"][optionName]
            const transminterAddress = circleContracts["MessageTransmitterV2"][nameTochainMap[paymentDetails?.token.chain]]
            console.log("tttt:", destinationDomainId)
            const res = await cctpData.get(`/cctpv2/get-usdc-fee/${sourceDomainId}/${destinationDomainId}`);
            // if error 404, same chain
            //console.log("checkGasfee;", res.data.message[1])
            //console.log("tokenMesagger:",  )
            
            //console.log("tkt:", transminterAddress)
            const usdcAddress = USDC_CONTRACTS[optionName]
            await approveUSDC({
                usdcAddress: usdcAddress,
                tokenMessengerAddress: tkMess,
                amount: paymentDetails.amount.$numberDecimal, // USDC
            }) 
            console.log("working:", typeof Number(paymentDetails.amount.$numberDecimal))
            console.log("soD:", sourceDomainId)
            const hash = await depositForBurn({
                amount: 1, //Number(paymentDetails.amount.$numberDecimal),
                destinationDomain: destinationDomainId,
                mintRecipient: paymentDetails.receiverAddress,
                burnToken: usdcAddress,
                maxFee: 500n,
                minFinalityThreshold: 1000,
            }) 
             if (hash) {
                const msg = await retrieveMsg(sourceDomainId, hash)
                console.log("nowmint:", msg, transminterAddress)
                console.log("minting:", msg)
                const getMint = await lynkXData.post("/cross-chain-mint", {
                    walletId: paymentDetails.walletId, message: msg.message, attestation: msg.attestation, contractAddress: transminterAddress
                });
                setTransact(false)
                if (getMint.status === 200) {
                    alert("INITIATED")
                }
            //const minted = await mintUSDC({transmitterAddress: transminterAddress, attestation: msg})
            //console.log("mint", minted) 
                //const msgT = circleContracts["MessageTransmitterV2"][nameTochainMap[paymentDetails?.token.chain]]
                
                
            }
            //console.log("deposit:", depositForBurn, burnStatus, burnTxHash)
           

        } catch (err) {
            console.log("errghh:", err)
            if (err.code === "ERR_BAD_REQUEST") {setErrMessage(true); setTransact(false)}
        }
     }
      

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
                                        <input type="text" value={paymentDetails.token.chain.toUpperCase()} readOnly className='bg-[#D9D9D9] p-2 pl-3 rounded-[6px] outline-none text-black'/>
                                    </div>
                                    <div className='flex flex-col w-[48%] relative'>
                                        <label htmlFor="" className='text-[14px]' onClick={handleSend}>Source Chain:</label>
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
                                        <input type="text"  className='bg-[#D9D9D9] p-2 pl-3 rounded-[6px] outline-none text-black ' value={`$${paymentDetails.amount.$numberDecimal}`} readOnly/>
                                    </div>
                                    <div className='w-[48%] flex items-end h-full'>
                                        <button className='w-full bg-red-600 rounded-[9px] h-[67%] items-end cursor-pointer' onClick={handleSend}>{!transact ? "Send" : "sending"} </button>

                                    </div>
                                    
                                </div>
                                
                                {errMessage && <p className='text-red-600/50'>!They are on the same chain send normally from metamask, this is only for cross chain transaction</p>}
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