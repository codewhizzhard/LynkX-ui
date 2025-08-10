import React from 'react';
import merchant from '../../assets/landingPage/merchant.png';
import { FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Role = () => {
  return (
    <main className='flex justify-between px-10 pt-5 gap-10 pb-1'>
        <div className='min-w-[50%] max-w-[50%] flex flex-col gap-4'>
            <div className='bg-gradient-to-r from-[#865DFF80] to-[#009FBD80] rounded-[30px] p-1 h-full'>
                <div className='bg-gradient-to-t from-[#12191B66] to-[#12191B66] rounded-[30px] w-full h-full flex flex-col justify-center items-center px-8 py-2 gap-2'>
                    <img src={merchant} alt="merchant" className='h-[90px] w-[100px]'/>
                    <p> They play a providing prodindividual   the economy by providing prodindividual that sells goods or services to</p>
                    <Link to={"/merchant"} className='cursor-pointer bg-[#009FBD] rounded-[10px] h-[39px] w-[190px] flex justify-center items-center gap-2 text-[16px] hover:bg-[#009FBD]/70'>Merchant <FiArrowRight /></Link>
                </div>
            </div>
            <div className='bg-gradient-to-r from-[#865DFF80] to-[#009FBD80] rounded-[30px] p-1 h-full'>
                <div className='bg-gradient-to-t from-[#12191B66] to-[#12191B66] rounded-[30px] w-full h-full flex flex-col justify-center items-center px-8 py-2 gap-2'>
                    <img src={merchant} alt="merchant" className='h-[90px] w-[100px]'/>
                    <p> They pthe economy   the economy by providing prodindividual that sells goods or services to</p>
                    <Link to={"/liquidity-provider"}  className='cursor-pointer bg-[#009FBD] rounded-[10px] h-[39px] w-[190px] flex justify-center items-center gap-2 text-[16px] hover:bg-[#009FBD]/70'>Liquidity Provider <FiArrowRight /></Link>
                </div>
            </div>
        </div>
        
        <div className='bg-gradient-to-r from-[#865DFF80] to-[#009FBD80] rounded-[30px] p-1 max-w-[50%] min-w-[50%]'>
                <div className='bg-gradient-to-t from-[#12191B66] to-[#12191B66] rounded-[30px] w-full h-full flex flex-col justify-center items-center px-8 py-2 gap-2'>
                    <img src={merchant} alt="merchant" className='h-[90px] w-[100px]'/>
                    <p> They play a providing goods or needsA  services to customers. They play a crucial role in the economy by providing products and services that meet consumer needsA liquid is a business or individual that sells goods or services to customers. They play a crucial role in the economy by providing products and services that meet consumer needsA liquid is a business or individual that sells goods or services to customers. They play a crucial role in the economy by providing products and services that meet consumer needsA liquid is a business or individual that sells goods or services to customers. They play a crucial role in the economy by providing products and services that meet consumer needsA liquid is   the economy by providing prodindividual that sells goods or services to</p>
                    <Link to={"/treasury-manager"} type='button' className='cursor-pointer bg-[#009FBD] rounded-[10px] h-[39px] w-[190px] flex justify-center items-center gap-2 text-[16px] hover:bg-[#009FBD]/70'>Treasury Manager <FiArrowRight /></Link>
                </div>
            </div>
    </main>
  )
}

export default Role