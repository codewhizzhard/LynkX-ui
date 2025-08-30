import React from 'react';
import merchant from '../../assets/landingPage/merchant.png';
import { FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Role = () => {
  return (
    <main className='flex justify-between px-10 pt-5 gap-10 pb-1'>
        <div className='min-w-[50%] max-w-[50%] flex flex-col gap-4'>
            <div className='bg-gradient-to-r from-[#865DFF80] to-[#009FBD80] rounded-[30px] p-1 h-full'>
                <div className='bg-gradient-to-t from-[#12191B66] to-[#12191B66] rounded-[30px] w-full h-full flex flex-col justify-center items-center px-8 py-2 gap-1'>
                    <img src={merchant} alt="merchant" className='h-[90px] w-[100px]'/>
                    <p> Enjoy gasless transfers with Circle Smart Contract Accounts (SCA) and fast cross-chain settlement through Circle CCTP v2 Fast Transfer.</p>
                    <Link to={"/merchant/"} className='cursor-pointer bg-[#009FBD] rounded-[10px] h-[39px] w-[190px] flex justify-center items-center gap-2 text-[16px] hover:bg-[#009FBD]/70'>Merchant <FiArrowRight /></Link>
                </div>
            </div>
            <div className='bg-gradient-to-r from-[#865DFF80] to-[#009FBD80] rounded-[30px] p-1 h-full'>
                <div className='bg-gradient-to-t from-[#12191B66] to-[#12191B66] rounded-[30px] w-full h-full flex flex-col justify-center items-center px-8 py-2 gap-1'>
                    <img src={merchant} alt="merchant" className='h-[90px] w-[100px]'/>
                    <p>Benefit from gasless SCA accounts and CCTP v2 Fast Transfer, making cross-chain liquidity deployment seamless by providing capital into protocols like Aave using Circle-created wallets. </p>
                    <div   className='cursor-pointer bg-[#009FBD] rounded-[10px] h-[39px] w-[190px] flex justify-center items-center gap-2 text-[16px] hover:bg-[#009FBD]/70' onClick={() => alert("Role not yet added")}>Liquidity Provider <FiArrowRight /></div>
                </div>
            </div>
        </div>
        
        <div className='bg-gradient-to-r from-[#865DFF80] to-[#009FBD80] rounded-[30px] p-1 max-w-[50%] min-w-[50%]'>
                <div className='bg-gradient-to-t from-[#12191B66] to-[#12191B66] rounded-[30px] w-full h-full flex flex-col justify-center items-center px-8 py-1 gap-1'>
                    <img src={merchant} alt="merchant" className='h-[90px] w-[100px]'/>
                    <p> As a Treasury Manager, you can manage wallets across eight chains with Circle — all gasless through Smart Contract Accounts (SCA).

                        With Auto-Payment, salaries go out automatically every month, ensuring your workers are always paid on time.

                        With Auto-Rebalance, your funds are consolidated or shifted across chains, so liquidity is always where you need it.

                        All cross-chain movement runs on Circle CCTP v2 Fast Transfer, and your dashboard gives you a unified USDC view of balances, payouts, and rules.

                        In short: effortless payroll, smart rebalancing, and complete treasury control — all in Circle.</p>
                    <div  type='button' className='cursor-pointer bg-[#009FBD] rounded-[10px] h-[39px] w-[190px] flex justify-center items-center gap-2 text-[16px] hover:bg-[#009FBD]/70' onClick={() => alert("Role not yet added")}>Treasury Manager <FiArrowRight /></div>
                </div>
            </div>
    </main>
  )
}

export default Role