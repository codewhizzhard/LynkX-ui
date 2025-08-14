import { useAccount, useReadContract } from 'wagmi'
import { erc20Abi, formatUnits } from 'viem'

export function useUSDCBalance(usdcAddress) {
  const { address } = useAccount()

  const { data, isLoading, error } = useReadContract({
    address: usdcAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address],
  })

  // Format to human-readable (6 decimals for USDC)
  const balance = data ? formatUnits(data, 6) : '0'

  return { balance, isLoading, error }
}