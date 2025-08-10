/* import { useState } from 'react'
import { useAccount, useWalletClient, useChainId } from 'wagmi'
import { constructSimpleSDK, SwapSide } from '@velora-dex/sdk'
import axios from 'axios'
import { parseUnits } from 'viem'

// Supported testnet USDC addresses
const USDC_TESTNET = {
  80001: '0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa', // Mumbai example
  80002: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359', // Amoy
  11155111: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', 
}

// Native token placeholder for ParaSwap
const NATIVE_TOKEN = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

export default function ProxyAwareContract() {
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const chainId = useChainId() // replaces useNetwork

  const [loading, setLoading] = useState(false)

  const handleSwap = async () => {
    if (!address) return alert('Please connect your wallet')
    if (!walletClient) return alert('Wallet client not available')
    if (!chainId) return alert('No chain detected')

    const USDC = USDC_TESTNET[chainId]
    if (!USDC) return alert(`No USDC token configured for chain ${chainId}`)

    // Construct ParaSwap Simple SDK (staging endpoint for testnets)
    const simpleSDK = constructSimpleSDK(
      {
        axios,
        chainId,
        axios, // staging for testnets
      },
      {
        viemClient: walletClient,
        account: address,
      }
    )

    setLoading(true)
    try {
      const srcAmount = parseUnits('0.1', 18).toString() // assume 18 decimals for native token

      // --- 1. Get Best Rate
      const priceRoute = await simpleSDK.swap.getRate({
        srcToken: NATIVE_TOKEN,
        destToken: USDC,
        amount: srcAmount,
        userAddress: address,
        side: SwapSide.SELL,
      })
      console.log('Price Route:', priceRoute)

      // --- 2. Build Transaction
      const txParams = await simpleSDK.swap.buildTx({
        srcToken: NATIVE_TOKEN,
        destToken: USDC,
        srcAmount,
        priceRoute,
        userAddress: address,
        slippage: 250, // 2.5%
        partner: 'lynkx',
      })
      console.log('Tx Params:', txParams)

      // --- 3. Send Transaction (native token swap)
      const hash = await walletClient.sendTransaction({
        to: txParams.to,
        data: txParams.data,
        value: BigInt(txParams.value || 0),
      })

      console.log('Swap Tx Hash:', hash)
      alert(`Swap successful. Tx: ${hash}`)
    } catch (err) {
      console.error('Swap error:', err)
      alert('Swap failed, see console for details')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleSwap}
      disabled={loading || !address}
      className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
    >
      {loading ? 'Swapping...' : 'Swap Native → USDC'}
    </button>
  )
}
 */


export default function ProxyAwareContract() {

  
}