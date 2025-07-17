import React from 'react'
import sidebarData from './sidebarData';
import { Link, useLocation, useParams } from 'react-router-dom';

const Sidebar = () => {

    const locate = useLocation();

    const path = locate.pathname.slice(1);
    const pathParts = path.split("/").filter(Boolean)[0];
    const { userType } = useParams();
    console.log("pat:", pathParts)
   
   /*  sidebarData[pathParts].map((content, index) => {
        if (`/${param.userType}${content.to}` === locate.pathname) console.log("yes")
        console.log("lll:", `/${param.userType}${content.to}`)
        console.log("pat:", locate.pathname)
    }) */
    
    
  return (
    <div className='py-10 z-0'>
     <ul className='flex flex-col gap-8 px-2'>{
        sidebarData[pathParts].map((content, index) => (
            <Link to={`/${userType}${content.to}`}><li key={index} className={`py-4  rounded pl-2 text-[14px] font-bold  border-2 border-blue-500 ${locate.pathname === `/${userType}${content.to}` ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-500"}`}>{content.name}</li></Link>

        ))}
    </ul>
       
    
        
    </div>
  )
}/* 
    ${locate.pathname === `${`/${param.userType}/${content.name}`} ? "bg-blue-500" : "bg-red-800"}
*/

export default Sidebar