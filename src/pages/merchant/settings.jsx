import React, { useEffect, useState } from 'react'
import profile from "../../assets/pages/userImage.png";
import {z} from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import lynkXData from '../../service/axios';
import { useAccount } from 'wagmi';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

const Settings = () => {

    const {address, isConnected} = useAccount();
    
      const [wallets, setWallets] = useState([]);
      const [editVaultName, setEditVaultName] = useState({});
      const [showEdit, setShowEdit] = useState({});
      const [vaultName, setVaultName] = useState("");
      const [reload, setReload] = useState(false)

      const getAllUserWallet = async () => {
        if (!address) return; // avoid calling API without address
        try {
          console.log("Fetching wallets for:", address);
          const res = await lynkXData.get(`/getUserAddresses/${address}`);
          console.log("Wallets:", res.data?.wallets); // <- use res.data
          if (res?.status === 200) {
            setWallets(res.data?.wallets);
            setShowEdit(
            res.data.wallets.reduce((acc, _, i) => {
                acc[i] = true;
                return acc;
            }, {})
            );
            console.log("settings:", res.data?.wallets)
            return res?.data?.wallets
            //console.log("settings:", res.data?.wallets)
          }
          
        } catch (err) {
          console.error("Error fetching wallets:", err);
        }
      };

     useEffect(() => {
        if (isConnected && address) {
            getAllUserWallet();
        }
        }, [isConnected, address, reload]);

    const [state, setState] = useState({profile: true, wallet: false});
    const handleChangePage = (key) => {
        setState((prev) => 
            Object.fromEntries(
                Object.keys(prev).map((k) => [k, k === key])
            )
        )
    }

    const profileSchema = z.object({
        username: z.string().min(2, "username is required").max(15, "too long"),
        about: z.string().min(5, "too short").max(200, "too long")
    })

    const {register, handleSubmit, formState: {isSubmitting, errors}} = useForm({
        resolver: zodResolver(profileSchema)
    })


    const handleChangeProfile = async (data) => {
        //console.log("ss:", data)
        try {
             if (!isConnected) return (<p>Connect your wallet</p>)
            const res = await lynkXData.post("/changeProfile", {username: data?.username, about: data?.about, address: address})
            console.log("res:", res?.data?.data?.username)
            if (res?.status === 200) {
                localStorage.setItem("userData", res?.data?.data?.username);
            }
        } catch (err) {
            console.log("err", err?.response?.data?.message)
        }
        
    }

    const handleChangeVaultName = (index) => {
        setEditVaultName({ [index]: true });
        setShowEdit((prev) =>
        Object.keys(prev).reduce((acc, key) => {
            acc[key] = Number(key) === index ? false : true;
            return acc;
        }, {})
        );
    };

    const handleSaveVaultName = async(i, vaultAddress) => {
        try {
            const res = await lynkXData.post("/change-vaultName", {address, vaultName, vaultAddress });
            if (res?.status === 200) {
            setVaultName("")
            const getWallets = await getAllUserWallet()
            console.log("wwhh:", getWallets)
            if (getWallets.length > 0) {
                alert(res.data.message);
                setEditVaultName((prev) => ({...prev, [i]: false}))

            }
           
            /* setShowEdit((prev) => ({...prev, [i]: true}))
            setEditVaultName((prev) => ({...prev, [i]: false})) */
            
            }
        } catch (err) {
            console.log("err:", err);
        }
    }


    
    
  return (
    <section className='text-[#B0B0B0] space-y-2'>
        <span className='border-dashed border-2 border-[#585858] py-1 px-2 justify-center text-[18px] italic flex'>
            User Profile
        </span>
        {/* user profile setting */}
        {state.profile && 
        <form className='bg-[#202225] rounded-[40px] h-full py-2 flex justify-center flex-col items-center w-full gap-2 ' onSubmit={handleSubmit(handleChangeProfile)}>
            <div className='w-[87px] h-[87px] rounded-[100%] border-2 border-dashed flex items-center gap-3'><img src={profile} alt="" className='w-full h-full'/> <span>Edit</span></div>
            <div className='flex flex-col gap-1 w-full justify-center items-center'>
                <div className='flex  justify-start w-[50%]'><label htmlFor="" className='text-[#009FBD] text-[16px] font-semibold italic'>Edit Username</label></div>
                <input type="text" className='w-[50%] bg-[#B0B0B0] rounded-[7px] p-2 outline-none text-[#292C31]' {...register("username")}/>
                {errors?.username && <p className='text-red-500 text-[12px] w-[50%] flex justify-start'>{errors.username?.message}</p>} 
            </div>
            <div className='flex flex-col gap-1 w-full justify-center items-center'>
                <div className='flex  justify-start w-[50%]'><label htmlFor="" className='text-[#009FBD] text-[16px] font-semibold italic'>Edit About</label></div>
                <textarea type="text" className='w-[50%] bg-[#B0B0B0] rounded-[7px] p-2 outline-none text-[#292C31]' {...register("about")} />
                 {errors?.about && <p className='text-red-500 text-[12px] w-[50%] flex justify-start'>{errors.about?.message}</p>} 
            </div>
            <div className='flex w-[50%] justify-between'>
                <button type="submit" className='bg-[#009FBD] rounded-[7px] text-white py-3 px-8 text-center' >Save Changes</button>
                <button className='flex gap-1 items-center cursor-pointer pt-2' type='button' onClick={() => handleChangePage("wallet")}>Wallet <FiArrowRight className='pt-[3px]'/></button>
            </div>
            
        </form>
}  
    {/* wallet setting page */}
    
    {state.wallet && wallets.length > 0 && <div className='bg-[#202225] rounded-[40px] p-3 h-[65vh]'>
    <ul  className=' flex flex-col w-full gap-4 h-[56vh] overflow-y-auto pb-2 items-center'>
        {wallets.map((wallet, index) => (
            <li className='w-[70%] flex flex-col gap-2 items-center bg-[#009FBD]/25 p-4 rounded-[20px]' key={index}>
                <span className='text-[20px] font-semibold text-blue-200/40'>{wallet.walletName.toUpperCase()}</span> 
                <span>{wallet.address}</span> 

                {showEdit[index] && <span className=' bg-purple-500/80 p-2 px-8 rounded-[11px] cursor-pointer' onClick={() => handleChangeVaultName(index)}>Edit vault name</span>}
                {editVaultName[index] === true &&<input type="text" placeholder='change vaultName' className='w-[50%] bg-[#B0B0B0] p-2 rounded-[7px] outline-none text-black' value={vaultName} onChange={(e) => setVaultName(e.target.value)}/>}
                {editVaultName[index] === true && <div className='flex justify-between w-[50%]'><span className='bg-red-500/60 px-8 py-2 rounded-[11px] cursor-pointer' onClick={() => {setShowEdit((prev) => ({...prev, [index]: true})); setEditVaultName((prev) => ({...prev, [index]: false}))}}>Cancel</span> <span className='bg-blue-600/50 py-2 px-10 cursor-pointer rounded-[11px]' onClick={() => handleSaveVaultName(index, wallet.address)}>Save</span></div>}
            </li>
        ))}
    </ul>
    <div className='w-full px-10 py-2 flex justify-between items-center'>
            <button className='flex gap-1 items-center cursor-pointer' onClick={() => handleChangePage("profile")}><FiArrowLeft  className='pt-[2px]'/> User profile</button>
            <button className='flex gap-1 items-center cursor-pointer' onClick={() => handleChangePage("others")}>Others<FiArrowRight className='pt-[2px]'/></button>
        </div>
     </div> 
    }
        
    
    </section>
  )
}

export default Settings