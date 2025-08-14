import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { erc20Abi, parseUnits } from 'viem'
import { useState } from 'react'



export function useSendUSDC(chainName) {
  const [hash, setHash] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const { writeContract } = useWriteContract()
  const { data: receipt } = useWaitForTransactionReceipt({ hash })

  const sendUSDC = async (to, amount, usdcAddress) => {
    setError(null)
    setIsLoading(true)
    try {
      const decimals = 6 // USDC decimals
      const txHash = await writeContract({
        address: usdcAddress,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [to, parseUnits(amount.toString(), decimals)],
      })
      setHash(txHash)
      return txHash
    } catch (err) {
      console.error(err)
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    sendUSDC, // function to call
    hash,
    receipt,
    isLoading,
    error,
  }
}
