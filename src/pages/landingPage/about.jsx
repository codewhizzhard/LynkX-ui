import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import "../merchant/scroll.css"

const About = () => {

   
    const [role, setRoles] = useState("Merchant(M)");

    const abouts = {
        "Merchant(M)": [<div className='flex flex-col gap-2'>
        <span>Merchant in LynkX is a business owner in any part of the world (Particularly in Africa) who wants to receive payments in USDC from customers across multiple chains — Ethereum Sepolia, Avalanche Fuji, Base Sepolia, and Polygon (Testnet). Instead of managing wallets on each chain, the merchant is given <b className='text-blue-500/80'>four (4) developer-controlled wallets through Circle</b>, which are fully controlled inside LynkX.</span>
        <span>The wallets provided are <b className='text-blue-500/80'>Circle Smart Contract Accounts (SCA)</b>. With SCAs, the merchant enjoys a <b className='text-blue-500/80'>gasless experience</b> — they can move funds internally or perform transactions between their created wallets without worrying about paying gas fees with the native token, since Circle sponsors those costs, and they can also perform <b className='text-blue-500/80'>Circle CCTP v2 Fast Transfer if it the transaction is on multichains.</b></span>

        <span>To receive money, the merchant can easily create a payment link, which can be sent to the customer on any chatting platform (like whattsapp, facebook, instagram). This link allows any customer to send USDC from one of the supported chains from their end to the merchant registered on lynkX, while settlement happens automatically through <b className='text-blue-500/80'>Circle CCTP v2 Fast Transfer</b>, ensuring fast and reliable cross-chain transfers into the merchant’s chosen wallet.</span>
        On the dashboard, the merchant sees all of their balances consolidated in USDC. They can track their funds across different chains, view transaction history, and manage how money flows between their wallets.
        In the settings area, the merchant can update their business name, change wallet labels, and also create workspaces. Workspaces act as integrations with external platforms like Amazon or Shopify, letting the merchant seamlessly connect their LynkX account to the tools they already use for business.
        <span>What goes around comes around, keeping all their <b className='text-blue-500/80'>FUND$ IN CIRCLE</b></span>
        </div>] 
        ,
        "Liquidity Provider(LP)": [<div className='flex flex-col gap-2'>
            <span>Liquidity Provider in LynkX are investors who wants to provide liquidity and grow their funds through integrations such as <b className='text-blue-500/80'>Aave</b>. Instead of manually setting up multiple wallets, the Liquidity Provider is given <b className='text-blue-500/80'>eigth (8) developer-controlled wallets through Circle</b>, which are fully managed inside LynkX.</span>

            <span>The wallets provided are <b className='text-blue-500/80'>Circle Smart Contract Accounts (SCA)</b>. With SCAs, the Liquidity Provider enjoys a <b className='text-blue-500/80'>gasless experience</b> — they can move funds internally or perform transactions between their wallets without worrying about native gas fees, since Circle sponsors those costs. They can also perform <b className='text-blue-500/80'>Circle CCTP v2 Fast Transfer</b> when moving assets across multichains.</span>

            <span>To fund their account, the Liquidity Provider can create a receive payment link. This link can be shared with anyone who wants to send them USDC. Once received, settlement is handled automatically through <b className='text-blue-500/80'>Circle CCTP v2 Fast Transfer</b>, ensuring fast and secure cross-chain transfers into their chosen wallet.</span>

            On the dashboard, the Liquidity Provider can view all their balances consolidated in USDC. They can also track performance, monitor liquidity positions, and manage how funds are distributed across chains and lending protocols in their Liquid section.

            <span>Liquidity Providers main focus is on funding, investing, and keeping their <b className='text-blue-500/80'>FUND$ IN CIRCLE</b>.</span>
            </div>],
        "Treasury manager(TM)": [<div className='flex flex-col gap-2'>
            <span>Treasury Manager in LynkX is a bigger version of the merchant — an organization that wants to manage large-scale operations such as paying employees and balancing funds across multiple chains. Instead of handling everything manually, the Treasury Manager is provided with <b className='text-blue-500/80'>eight (8) developer-controlled wallets through Circle</b>, giving them wider multichain coverage and complete control inside LynkX.</span>

            <span>The wallets provided are <b className='text-blue-500/80'>Circle Smart Contract Accounts (SCA)</b>. With SCAs, the Treasury Manager enjoys a <b className='text-blue-500/80'>gasless experience</b> — they can automate payments and rebalance funds across wallets without worrying about gas fees, since Circle sponsors those costs. They also have access to <b className='text-blue-500/80'>Circle CCTP v2 Fast Transfer</b> to move USDC instantly across chains whenever necessary.</span>

            <span>One of their core features is <b className='text-blue-500/80'>Auto-Payment</b>. Treasury Managers can set up recurring salary payments so that at the end of every month, funds are automatically deducted from a chosen chain and sent directly to their workers’ accounts, reducing manual effort and ensuring timely payouts.</span>

            <span>Another essential feature is <b className='text-blue-500/80'>Auto-Rebalance</b>. With this, the Treasury Manager can automatically consolidate or redistribute their USDC across all eight wallets, bringing everything into a single chain or balancing liquidity evenly as needed. This ensures smooth treasury operations and constant availability of funds where required.</span>

            On the dashboard, the Treasury Manager has a complete view of their balances across all eight chains, scheduled automations, and payout history. They can fine-tune automation rules, monitor worker payments, and maintain full oversight of how their treasury is allocated.

            <span>With automation, multichain coverage, and control, Treasury Managers keep all their <b className='text-blue-500/80'>FUND$ IN CIRCLE</b>.</span>
        </div>]
    };/* "Merchant", "Liquidity provider", "Treasury manager" */
  return (
    <main className="bg-gradient-to-r from-[#009FBD80] to-[#865DFF80] p-[3px] rounded-xl mt-10 h-[81%]">
    <div className=" rounded-xl p-5 text-white bg-black h-full flex flex-col gap-3">
        <span className='bg-gradient-to-r from-[#013038B2] to-[#01313966] rounded-[15px] px-8 py-4 justify-between flex text-[18px] font-semibold italic '>
            {Object.keys(abouts).map((about, index) => (
                <li onClick={() => setRoles(about)} className={`px-8 border border-[#009FBD] rounded-[7px] py-[6px] cursor-pointer ${role === about ? "bg-[#009FBD]" : ""}`} key={index}>{about}</li>
            ))}
            
        </span>
        <article className='pt-4 text-[18px] px-8   overflow-y-scroll h-[296px] scroll-invisible'>
            {abouts[role]}
        </article>
    </div>
</main>

  )
}

export default About