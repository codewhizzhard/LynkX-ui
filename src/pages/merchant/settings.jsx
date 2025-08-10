import React, { useEffect, useRef, useState } from 'react'
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
      const [imageBase64, setImageBase64] = useState(null);
      const [preview, setPreview] = useState(null);
      const [loading, setLoading] = useState(false);
      const [profilePics, setProfilePics] = useState("");
      const [addWorkspace, setAddWorkspace] = useState(false);
      const [workspace, setWorkspace] = useState("");
      const [storedWorkspace, setStoredWorkspace] = useState([]);
      const fileInputRef = useRef(null);
      //console.log("plea:", workspace, addWorkspace)

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

    const [state, setState] = useState({profile: true, wallet: false, others: false});
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

    useEffect(() => {
        const getPics = localStorage.getItem("image")
        const getWorkspace = JSON.parse(localStorage.getItem("workspaces") || "[]");
        setProfilePics(getPics)
        
        //setWorkspace("")
        setStoredWorkspace(getWorkspace)
        //console.log("ggg:", profilePics)
    }, [])

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result;
      setImageBase64(base64String);
      setPreview(base64String);
    };

    reader.readAsDataURL(file);
  };

  const handleClick = async () => {
    if (!imageBase64) {
      // No image selected: open file dialog
      fileInputRef.current?.click();
    } else {
      // Image selected: upload it
      setLoading(true);
      try {
        const res = await lynkXData.post("/changeProfileImage", {
            address: address, profilePicture: imageBase64
        });
        alert(res.data.message || "Image uploaded successfully!");
        console.log("image:", res)
        localStorage.setItem("image", res?.data?.data?.profilePicture)
        // Optional: reset state after upload
        setImageBase64(null);
        setPreview(null);
      } catch (err) {
        console.error("Upload failed", err);
        alert("Upload failed");
      } finally {
        setLoading(false);
      }
    }
  };


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

    const handleAddWorkspace = async() => {
        //setAddWorkspace(true)
         console.log("worsp:", workspace)
        if (!workspace) return 
        try {
            const res = await lynkXData.post("/addWorkspace",{address: address, workspace: workspace})
            if (res.status === 200) {
                alert("workspace added"); 
                console.log("res:", res.data?.data?.workspace)
                localStorage.setItem("workspaces", JSON.stringify(res.data?.data?.workspace));
                setWorkspace("")
                setAddWorkspace(false)
            }
        } catch (err) {console.log("err:", err)} 
    }


    
    
  return (
    <section className='text-[#B0B0B0] space-y-2'>
        <span className='border-dashed border-2 border-[#585858] py-1 px-2 justify-center text-[18px] italic flex'>
            User Profile
        </span>
        {/* user profile setting */}
        {state.profile && 
        <form className='bg-[#202225] rounded-[40px] h-full py-2 flex justify-center flex-col items-center w-full gap-2 ' onSubmit={handleSubmit(handleChangeProfile)}>
            <div className='w-[87px] h-[87px] rounded-full border-2 border-dashed flex flex-col items-center justify-center relative'>
        {/* Image Preview */}
        <img
            src={profilePics ? profilePics : preview ? preview :  profile} // fallback to default image if no preview
            alt="Profile"
            className='w-full h-full object-cover rounded-full'
        />

        {/* Hidden File Input */}
        <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
        />

        {/* Action Text: Choose or Upload */}
        <span
            className='absolute bottom-[-1.5rem] text-xs underline cursor-pointer'
            onClick={handleClick}
        >
            {loading
            ? "Uploading..."
            : imageBase64
            ? "Upload Image"
            : "Choose Image"}
        </span>
        </div>

            {/* <div className='w-[87px] h-[87px] rounded-[100%] border-2 border-dashed flex items-center gap-3'><img src={preview ? preview : profile} alt="" className='w-full h-full' type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}/> <span className='w-full underline cursor-pointer'  onClick={handleClick}
            disabled={loading}>{loading? "Uploading..." : imageBase64 ? "Upload Image" : "Choose Image"}</span></div> */}
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
                <button type="submit" className='bg-[#009FBD] rounded-[7px] text-white py-3 px-8 text-center cursor-pointer' >Save Changes</button>
                <button className='flex gap-1 items-center cursor-pointer pt-2' type='button' onClick={() => handleChangePage("wallet")}>Wallet <FiArrowRight className='pt-[3px]'/></button>
            </div>
            
        </form>
}  
    {/* wallet setting page */}
    {state.wallet && wallets.length === 0 && <p className='w-full text-center text-[17px]'>Loading...</p>}
    
    {state.wallet && wallets.length > 0 && <div className='bg-[#202225] rounded-[40px] p-3 h-[65vh]'>
    <ul  className=' flex flex-col w-full gap-4 h-[56vh] overflow-y-auto pb-2 items-center'>
        {wallets.map((wallet, index) => (
            <li className='w-[70%] flex flex-col gap-3 bg-[#009FBD]/25 p-4 rounded-[20px]' key={index}>
                <div className='flex w-full justify-between px-12'><span>NAME</span><span className='text-[20px] font-semibold text-blue-200/40'>{wallet.walletName.toUpperCase()}</span> </div>
                <div className='flex w-full justify-between px-12'><span>BLOCKCHAIN</span><span className='text-[17px] font-semibold text-blue-200/40'>{wallet.blockchain}</span> </div>
                <div className='flex w-full justify-between px-12'><span>STATE</span><span className='text-[17px] font-semibold text-blue-200/40'>{wallet.state}</span> </div>
                 <div className='flex w-full justify-between px-12'><span>ADDRESS</span><span className='text-[17px] font-semibold text-blue-200/40'>{wallet.address}</span> </div>

                {showEdit[index] && <span className=' bg-[#B0B0B0] py-2  rounded-[11px] cursor-pointer flex justify-center mx-12' onClick={() => handleChangeVaultName(index)}><p className='bg-blue-600/50 text-blue-100/40 p-2 px-8 rounded-[11px]'>Edit vault name</p> </span>}
                {editVaultName[index] === true && <div className='w-full flex flex-col gap-2 justify-center items-center pt-3'>
                    <input type="text" placeholder='change vaultName' className='w-[85%] bg-[#B0B0B0] p-3 rounded-[7px] outline-none text-black' value={vaultName} onChange={(e) => setVaultName(e.target.value)}/>
                    <div className='flex justify-between w-[85%]'><span className='bg-red-500/60 px-8 py-2 rounded-[11px] cursor-pointer' onClick={() => {setShowEdit((prev) => ({...prev, [index]: true})); setEditVaultName((prev) => ({...prev, [index]: false}))}}>Cancel</span> <span className='bg-blue-600/50 py-2 px-10 cursor-pointer rounded-[11px]' onClick={() => handleSaveVaultName(index, wallet.address)}>Save</span></div>
                    
                    </div>}
                
            </li>
        ))}
    </ul>
    <div className='w-full px-10 py-2 flex justify-between items-center'>
            <button className='flex gap-1 items-center cursor-pointer' onClick={() => handleChangePage("profile")}><FiArrowLeft  className='pt-[2px]'/> Profile</button>
            <button className='flex gap-1 items-center cursor-pointer' onClick={() => handleChangePage("others")}>Others<FiArrowRight className='pt-[2px]'/></button>
        </div>
     </div> 
    }

    {state.others && (
        <div className='bg-[#202225] rounded-[40px] p-3 h-[65vh] overflow-y-auto'>
            <p className='p-1 text-center text-bold text-[20px]'>JUST A CLICK AWAY, EVERYTHING CIRCLE ⏺️</p>
            <div className='flex gap-3 py-1 px-2'>
                <div className='w-[70%] flex flex-col gap-3 bg-[#009FBD]/25 p-4 rounded-[20px]'>
                    <h2 className='text-center text-[18px] text-black font-semibold'>Explore more 🚀</h2>
                    <ol className='text-[17px] font-medium'>
                        We believe you love your experience using lynkX built on circle already, everything getting done with just a click. Want even a better experience?
                        <li className='pt-2 pl-3 text-black'>Want to pay all your gas fee in USDC?</li>
                        <li className='pt-2 pl-3 text-black'>Want a gasless transaction?</li>
                    </ol>
                    <button type='button' className='bg-blue-500/50 py-2 rounded-[8px] cursor-pointer'>Just A Click Away</button>
                    </div>
                <div className='w-[70%] flex flex-col gap-3 bg-[#009FBD]/25 p-4 rounded-[20px]'>
                <h2 className='text-center text-[18px] text-black font-semibold'>Workspace 👌</h2>
                {storedWorkspace.length > 0 && storedWorkspace.map((workspace, index) => (
                    <a href={workspace}  key={index} target='_blank' rel='noopener noreferrer' className='cursor-pointer'>{workspace}</a>
                ))}
                {
                    addWorkspace &&  <div className='w-full flex justify-center'>
                  
                 <input type="text" placeholder='paste your website link here' className='w-[70%] outline-none p-2 border-white border bg-white rounded-[7px]' onChange={(e) => setWorkspace(e.target.value)}/>
                </div>}
                <div>
                    <button  type='button' className='w-full' >
                        {addWorkspace ? <span className='bg-blue-500/50 py-2 px-5 w-[35%] rounded-[4px] mt-2 cursor-pointer' onClick={handleAddWorkspace}>Add</span> : <span onClick={() => setAddWorkspace(true)} className='bg-blue-500/50 p-2 w-[35%] rounded-[4px] mt-2 cursor-pointer' >Add Workspace</span>}
                    </button>
                </div>
               {/*  {addWorkspace &&
                }
                <div className='w-full text-center'>
                     <button type='button' className='w-full' >{workspace ? <span onClick={handleAddWorkspace} className='bg-blue-500/50 p-2 w-[35%] rounded-[4px] mt-2 cursor-pointer'>Add</span> : <span className='bg-blue-500/50 p-2 w-[35%] rounded-[4px] mt-2 cursor-pointer' onClick={setAddWorkspace(true)}>Add Workspace</span>}</button>
                </div> */}
               
                </div>

            </div>
            <div className='flex w-full justify-between px-2 cursor-pointer'><span className='flex gap-1 items-center' onClick={() => handleChangePage("wallet")}><FiArrowLeft  className='pt-[2px]'/> Wallet</span> <span className='flex gap-1 items-center' onClick={() => handleChangePage("profile")}>Profile <FiArrowRight className='pt-[2px]'/></span></div>
            
        </div>
    )}
        
    
    </section>
  )
}

export default Settings