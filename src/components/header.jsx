import React, { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { FaArrowDown, FaHome } from 'react-icons/fa';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const Header = () => {

    const { address, isConnected } = useAccount();
    const [dropdown, setDropdown]  = useState(false);
    const locate = useLocation();
    const handleDropdown = () => {
        setDropdown((prev) => !prev);
    }

    useEffect(() => {
        if (dropdown) {
            setDropdown(false);
        }
    }, [locate.pathname])
    
    const param = useParams();
    const navigate = useNavigate();
    const handleChangeRoute = (path) => {
        //param.userType = path;
        //console.log("param.userType:", param.userType);
        navigate(`/${path}`);
        /* console.log("param:", locate.pathname);
        const changeUserType = locate.pathname.split("/")[2];
        console.log("changeUserType:", changeUserType); */
        /* let userType = param.userType;
        userType = path;
        console.log("userType:", userType)
        console.log("param.userType:", param.userType) */
    }
    
  return (
    <header className='h-[70px] bg-gray-800 text-white flex fixed top-0 left-0 right-0 z-50 w-full'>
        <div className='w-[300px] border-2 border-white'>
            <img src="" alt="logo" className='px-6 py-3'/>
        </div>
        <div className='flex-grow border-2 border-white px-6 flex justify-between items-center'>
            <p>HI, USER</p>
            <div className='flex gap-8 items-center relative'>
                <div className='bg-blue-500 py-3 px-6 rounded-[8px] font-bold text-[17px]'>
                {isConnected ? (
                    <p className='text-white'>{address.slice(0,4) + "..." + address.slice(-3)}</p>
                ) : (
                    <p className='text-red-300'>Not connected</p>
                )}
               
                    
                </div>
                <FaArrowDown className={`text-2xl cursor-pointer ${dropdown ? "text-blue-500" : ""}`}  onClick={handleDropdown}/>
                    
                    {dropdown && (
                        <ul className='absolute right-0 top-15 bg-blue-500 font-semibold py-6 rounded-[11px] text-[15px] w-[200px] cursor-pointer'>
                            <li className='border-y-2 border-white w-full py-2 pl-2 hover:text-blue-500 hover:bg-white' onClick={() => handleChangeRoute("merchant")}>Merchant</li>
                            <li className='border-y-2 border-white w-full py-2 pl-2 hover:text-blue-500 hover:bg-white' onClick={() => handleChangeRoute("liquidityProvider")}>Liquidity Provider</li>
                            <li className=' border-y-2 border-white w-full py-2 pl-2 hover:text-blue-500 hover:bg-white'>Treasury Manager</li>
                        </ul>
                    )}
            </div>
            
        </div>
    </header>
  )
}

export default Header