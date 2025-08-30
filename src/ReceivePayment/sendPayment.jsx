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
import Web3 from "web3";
import { sepolia, avalancheFuji, baseSepolia, polygonAmoy } from 'viem/chains';
import { useWalletClient } from "wagmi";
import { erc20Abi, encodeFunctionData, getContract, http, createPublicClient, parseUnits, encodePacked, hexToBigInt, hexToSignature } from "viem";
import { paymaster } from './paymaster'
import { toSimple7702SmartAccount, createBundlerClient } from "viem/account-abstraction";
import tokenMessengerAbi from "../abi/tokenMessagerAbi.json";
//import { useSmartAccount } from './createSmartAccount'
import { getPublicClient } from 'wagmi/actions'
import { usePublicClient } from "wagmi";
import { signPermit } from "./permit.js";
import { privateKeyToAccount } from 'viem/accounts'
import { useSendUSDC } from './erc20Transfer.js'
import { useUSDCBalance } from './balance.js'
    
    



const SendPayment = () => {
    //const { getSmartAccount } = useSmartAccount();
    const { sendUSDC, hash, isLoading, error } = useSendUSDC('sepolia')
 
    const web3 = new Web3(`https://sepolia.infura.io/v3/0e92b732d2c44995b03942276a10198c`);

    const { id } = useParams()

    const {approveUSDC, status, txHash, receipt} = useApproveUSDC()

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
            if (err.status === 400) setLoading(false)
        }
    }

      const { data: walletClient } = useWalletClient();
      
    
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
        }
        const metamaskChainIdMap = {
            "Sepolia": 0,
            "Base Sepolia": 6,
            "Avalanche Fuji": 1,
            "Polygon Amoy": 7,
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
     
     const optionName = chainId && chainIdToName[chainId]

    const { depositForBurn, status: burnStatus, txHash: burnTxHash } = useDepositForBurn(circleContracts["TokenMessengerV2"][optionName])
   
     const { balance } = useUSDCBalance(USDC_CONTRACTS[optionName])
    
     const handleSend = async() => {
        if (!isConnected) {
            alert("CONNECT YOUR WALLET")
             return
        }
        
        setErrMessage(false)
        setTransact(true)
        if (balance < parseFloat(paymentDetails?.amount.$numberDecimal)) {
            alert("Insufficient USDC balance. Please fund your wallet.")
            setTransact(false)
            return 
        }
     

        const destinationDomainId = chainIdMap[paymentDetails?.token.chain.toUpperCase()]
        
       
        try {
            const usdcAddress = USDC_CONTRACTS[optionName]
            const sourceDomainId =  metamaskChainIdMap[walletClient.chain.name] 

            const tkMess = circleContracts["TokenMessengerV2"][optionName]
            const transminterAddress = circleContracts["MessageTransmitterV2"][nameTochainMap[paymentDetails?.token.chain]]
            console.log("transact:", transact)
            if (sourceDomainId === destinationDomainId) {
              
                await sendUSDC(paymentDetails.receiverAddress, paymentDetails.amount.$numberDecimal, usdcAddress)
                setTransact(false)
            } else {
            const res = await cctpData.get(`/cctpv2/get-usdc-fee/${sourceDomainId}/${destinationDomainId}`);
         
            await approveUSDC({
                usdcAddress: usdcAddress,
                tokenMessengerAddress: tkMess,
                amount: paymentDetails.amount.$numberDecimal, // USDC
            }) 
           
            const hash = await depositForBurn({
                amount: Number(paymentDetails.amount.$numberDecimal),
                destinationDomain: destinationDomainId,
                mintRecipient: paymentDetails.receiverAddress,
                burnToken: usdcAddress,
                maxFee: 500n,
                minFinalityThreshold: 1000,
            }) 
             if (hash) {
                const msg = await retrieveMsg(sourceDomainId, hash)
         
                const getMint = await lynkXData.post("/cross-chain-mint", {
                    walletId: paymentDetails.walletId, message: msg.message, attestation: msg.attestation, contractAddress: transminterAddress
                });
                setTransact(false)
                if (getMint.status === 200) {
                    alert("INITIATED")
                }
         
            }
        }

        } catch (err) {
          console.log("err:", err)
            if (err.code === "ERR_BAD_REQUEST") {
                setTransact(false)
                setErrMessage(true); 
                }
        }
     }
       

/* const chainConfigs = {
  ethereumSepolia: sepolia,      // from viem/wagmi
  baseSepolia: baseSepolia,
  polygonAmoy: polygonAmoy,
  avalancheFuji: avalancheFuji,
}; */



/* const clients = {
  sepolia: createPublicClient({ chain: sepolia, transport: http() }),
  avalancheFuji: createPublicClient({ chain: avalancheFuji, transport: http() }),
  baseSepolia: createPublicClient({ chain: baseSepolia, transport: http() }),
  polygonAmoy: createPublicClient({ chain: polygonAmoy, transport: http() }),
}; *//* 
const handleSend = async () => {
  if (!isConnected) return;

  setErrMessage(false);
  setTransact(true);

  try {
    // --- 1) Resolve chain config ---
    const chainKey = paymentDetails.token.chain; // e.g. "polygonAmoy"

    const chainConfig = nameTochainMap[chainKey];
    const bundlerRpc = "https://public.pimlico.io/v2/11155111/rpc"; // store per-chain RPC in a config object

    if (!bundlerRpc || !chainConfig) {
      throw new Error(`Unsupported chain: ${chainKey}`);
    }

    console.log("chainConfig:", chainConfig, bundlerRpc);
    console.log("chainKey:", chainConfig);

    // --- 2) Resolve contracts ---
    const tkMess = circleContracts.TokenMessengerV2[optionName];
    console.log("optionNa:", tkMess)
    const transminterAddress = circleContracts.MessageTransmitterV2[nameTochainMap[paymentDetails?.token.chain]];
    console.log("transmit:", transminterAddress)
    const usdcAddress = USDC_CONTRACTS[optionName];
    console.log("usdcAddress:", usdcAddress)

    if (!tkMess || !transminterAddress || !usdcAddress) {
      throw new Error(`Missing contract address for chain: ${chainKey}`);
    }

    // --- 3) Create smart account ---
    const account = await toSimple7702SmartAccount({
      client: walletClient,
      owner: walletClient.account,
    });

    console.log("Smart account address:", account.address);

    // --- 4) Check USDC balance ---
    const usdc = getContract({ client, address: usdcAddress, abi: erc20Abi });
    const usdcBalance = await usdc.read.balanceOf([account.address]);

    if (usdcBalance < parseUnits(paymentDetails.amount.$numberDecimal.toString(), 6)) {
      setTransact(false);
      setErrMessage(true);
      console.warn(
        `Insufficient USDC. Fund ${account.address} with USDC on ${chainKey}`
      );
      return;
    }

    // --- 5) Create bundler client with paymaster ---
    const bundlerClient = createBundlerClient({
      transport: http(bundlerRpc),
      chain: sepolia,
      account,
      paymaster: {
        async getPaymasterData(params) {
          return paymaster.getPaymasterData({
            ...params,
            usdcAddress,
            account,
            client,
            amount: paymentDetails.amount.$numberDecimal,
            chain: sepolia,
          });
        },
      },
    });

    console.log("Bundler client ready:", bundlerClient.name);

    // --- 6) Format amount (USDC has 6 decimals) ---
    const amount6 = parseUnits(paymentDetails.amount.$numberDecimal.toString(), 6);

    // --- 7) Approve USDC spend (gas sponsored) ---
    const approveTxHash = await bundlerClient.sendTransaction({
      to: usdcAddress,
      data: encodeFunctionData({
        abi: erc20Abi,
        functionName: "approve",
        args: [tkMess, amount6],
      }),
    });
    console.log("Approve tx hash:", approveTxHash);
    await bundlerClient.waitForTransactionReceipt({ hash: approveTxHash });

    // --- 8) Burn USDC (gas sponsored) ---
    const destinationDomainId = chainIdMap[paymentDetails.token.chain.toUpperCase()];
    const sourceDomainId = 0; // or set if needed

    const burnTxHash = await bundlerClient.sendTransaction({
      to: tkMess,
      data: encodeFunctionData({
        abi: tokenMessengerAbi,
        functionName: "depositForBurn",
        args: [amount6, destinationDomainId, paymentDetails.receiverAddress, usdcAddress],
      }),
    });
    console.log("Burn tx hash:", burnTxHash);
    await bundlerClient.waitForTransactionReceipt({ hash: burnTxHash });

    // --- 9) Retrieve Circle attestation + mint ---
    const msg = await retrieveMsg(sourceDomainId, burnTxHash);
    const mintResponse = await lynkXData.post("/cross-chain-mint", {
      walletId: paymentDetails.walletId,
      message: msg.message,
      attestation: msg.attestation,
      contractAddress: transminterAddress,
    });

    setTransact(false);
    if (mintResponse.status === 200) {
      alert("INITIATED");
    }
  } catch (err) {
    console.error("Transaction error:", err);
    setErrMessage(true);
    setTransact(false);
  }
}; */

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
                                <div className='flex justify-between bg-[#D9D9D9] p-1 cursor-pointer'><button className={`w-[48%] bg-purple-500 ${cctpv2Option === "fast" ? "bg-purple-500" : ""} text-center rounded-[5px] cursor-pointer p-1`} type='button' onClick={() => handleChangeCctpv2Option("fast")}>Fast Transfer 🚀</button><button className={`w-[48%] ${cctpv2Option === "standard" ? "bg-purple-500" : ""} text-center rounded-[5px] cursor-pointer p-1`} type='button' /* onClick={() => handleChangeCctpv2Option("standard")} */>Standard Transfer 🛡️</button></div>
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
                                        <button className='w-full bg-red-600 rounded-[9px] h-[67%] items-end cursor-pointer' onClick={handleSend}>{transact ? "Sending" : "Send" } </button>

                                    </div>
                                    
                                </div>
                                
                                {errMessage && <p className='text-red-600/50'>{errMessage}</p>}
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