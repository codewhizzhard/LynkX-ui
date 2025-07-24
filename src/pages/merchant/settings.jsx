import React from 'react'
import profile from "../../assets/pages/userImage.png";
import {z} from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import lynkXData from '../../service/axios';
import { useAccount } from 'wagmi';

const Settings = () => {

    const {address, isConnected} = useAccount();

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

  return (
    <section className='text-[#B0B0B0] space-y-2'>
        <span className='border-dashed border-2 border-[#585858] py-1 px-2 justify-center text-[18px] italic flex'>
            User Profile
        </span>
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
            <button type="submit" className='bg-[#009FBD] rounded-[7px] text-white py-3 px-8' >Save Changes</button>
        </form>

    </section>
  )
}

export default Settings