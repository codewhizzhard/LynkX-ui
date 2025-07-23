import React from 'react'

import { Outlet } from 'react-router-dom'

import Nav from './nav'
import MainBody from './main'
const Layout = () => {
  return (

    <div className='flex gap-6 px-10 py-5 h-[100vh] bg-[#292C31] overflow-hidden'>

      <Nav />
      <MainBody />
    </div>
    
    
  )
}

export default Layout

{/* <div className='flex flex-col h-screen'>
        <Header />
        <main className='flex flex-grow flex-row pt-18 pb-1 overflow-y-hidden'>
            <div className=' bg-gray-800 text-white border-2 border-t-1 border-white flex-shrink-0 min-w-[300px]'>
                <Sidebar />
            </div>
            <div className='flex-grow p-4 border-2 border-white bg-gray-300 overflow-y-auto'>
                <Outlet />
            </div>
            
        </main>
    </div> */}