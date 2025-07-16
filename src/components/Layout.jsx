import React from 'react'
import Header from './header'
import { Outlet } from 'react-router-dom'
import Sidebar from './sidebar'
const Layout = () => {
  return (
    <div className='flex flex-col min-h-screen'>
        <Header />
        <main className='flex flex-grow flex-row pt-18 h-full pb-1 '>
            <div className='w-[300px] bg-gray-800 text-white border-2 border-t-1 border-white'>
                <Sidebar />
            </div>
            <div className='flex-grow p-4 border-2 border-white bg-gray-300'>
                <Outlet />
            </div>
            
        </main>
    </div>
  )
}

export default Layout