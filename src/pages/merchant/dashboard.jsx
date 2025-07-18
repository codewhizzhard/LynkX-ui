import React from 'react'
import { FiDollarSign, FiSearch } from 'react-icons/fi'

const Dashboard = () => {
  return (
    <section className='flex h-full gap-4'>

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
    </section>
  )
}

export default Dashboard