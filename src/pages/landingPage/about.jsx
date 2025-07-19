import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';

const About = () => {

   
    const [role, setRoles] = useState("Merchant(M)");

    const abouts = {
        "Merchant(M)": ["A merchant is a business or individual that sells goods or services to customers. They play a crucial role in the economy by providing products and services that meet consumer needs. A liquid is a business or individual that sells goods or services to customers. They play a crucial role in the economy by providing products and services that meet consumer needsA liquid is a business or individual that sells goods or services to customers. They play a crucial role in the economy by providing products and services that meet consumer needsA liquid is a business or individual that sells goods or services to customers. They play a crucial role in the economy by providing products and services that meet consumer needsA liquid is a business or individual that sells goods or services to customers. They play a crucial role in the economy by providing products and services that meet consumer needsA liquid is a business or individual that sells goods or services to customers. They play a crucial role in the economy by providing products and services that meet consumer needsA liquid is a business or individual that sells goods or services to customers. They play a crucial role in the economy by providing products and services that meet consumer needsA liquid is a business or individual that sells goods or services to customers. They play a crucial role in the economy by providing products and services that meet consumer needs"],
        "Liquidity Provider(LP)": ["A liquid is a business or individual that sells goods or services to customers. They play a crucial role in the economy by providing products and services that meet consumer needs."],
        "Treasury manager(TM)": ["A treasur is a business or individual that sells goods or services to customers. They play a crucial role in the economy by providing products and services that meet consumer needs."],
    };/* "Merchant", "Liquidity provider", "Treasury manager" */
  return (
    <main className="bg-gradient-to-r from-[#009FBD80] to-[#865DFF80] p-[3px] rounded-xl mt-10 h-[81%]">
    <div className=" rounded-xl p-5 text-white bg-black h-full flex flex-col gap-3">
        <span className='bg-gradient-to-r from-[#013038B2] to-[#01313966] rounded-[15px] px-8 py-4 justify-between flex text-[18px] font-semibold italic'>
            {Object.keys(abouts).map((about, index) => (
                <li onClick={() => setRoles(about)} className={`px-8 border border-[#009FBD] rounded-[7px] py-[6px] cursor-pointer ${role === about ? "bg-[#009FBD]" : ""}`} key={index}>{about}</li>
            ))}
            
        </span>
        <article className='pt-4 text-[18px] px-8 h-full overflow-y-auto'>
            {abouts[role]}
        </article>
    </div>
</main>

  )
}

export default About