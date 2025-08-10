import { getAddress, parseUnits, encodeFunctionData } from "viem";
import { usePublicClient, useWalletClient } from "wagmi";
import { useEffect, useState } from "react";

export function useApproveUSDC() {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [status, setStatus] = useState("idle");
  const [txHash, setTxHash] = useState(null);
  const [receipt, setReceipt] = useState(null);

  async function approveUSDC({ usdcAddress, tokenMessengerAddress, amount }) {
    try {
      setStatus("pending");
      //console.log("status:", status)

      const amountInSubunits = parseUnits(amount.toString(), 6); 
      //console.log("amount", amountInSubunits)// USDC is 6 decimals

      const data = encodeFunctionData({
        abi: [
          {
            type: "function",
            name: "approve",
            stateMutability: "nonpayable",
            inputs: [
              { name: "spender", type: "address" },
              { name: "amount", type: "uint256" },
            ],
            outputs: [{ name: "", type: "bool" }],
          },
        ],
        functionName: "approve",
        args: [getAddress(tokenMessengerAddress), amountInSubunits],
      });

      const hash = await walletClient.sendTransaction({
        to: getAddress(usdcAddress),
        data,
      });
      //console.log("hash:", hash)

      setTxHash(hash);
      return hash
      //setStatus("success");
    } catch (err) {
      //console.error("approveUSDC error:", err);
      setStatus("error");
    }
  }

  useEffect(() => {
    if (!txHash) return
    const waitForReceipt = async() => {
        try {
            const rcpt = await publicClient.waitForTransactionReceipt({hash: txHash});
            //console.log("rcpt:", rcpt);
            setReceipt(rcpt);
            setStatus("success");

        } catch (err) {
            //console.log("err", err)
            setStatus("error");
        }
    }
    waitForReceipt()

  }, [txHash, publicClient])


  return { approveUSDC, status, txHash, receipt };
}
