/* import {
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
} from 'wagmi/chains';
export const config = getDefaultConfig({
  appName: 'LynkX',
  projectId: 'ec8cbea08fa68f5527e22a70f9c187a4',
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true,
   // If your dApp uses server side rendering (SSR)
}); */

import { createConfig, http } from 'wagmi'
import { mainnet, polygon, optimism, arbitrum, base, sepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
  autoConnect: true,   // <-- ensures reconnect on refresh
  connectors: [
    injected({ shimDisconnect: true }),  // Only MetaMask / Injected Wallet
  ],
  chains: [sepolia, polygon, optimism, arbitrum, base, ],
   transports: {
    1: http(),          // Ethereum mainnet
    11155111: http(),   // Ethereum Sepolia
    137: http(),        // Polygon mainnet
    10: http(),         // Optimism mainnet
    42161: http(),      // Arbitrum mainnet
    84532: http(),      // Base Sepolia
  },
 /*  transports: {
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
  }, */
})
 