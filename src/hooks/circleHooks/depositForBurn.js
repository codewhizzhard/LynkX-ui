import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
//import { parseUnits } from "viem";
import { useState, useEffect } from "react";
import { addressToBytes32 } from "./addressToBytes32";
import TokenMessengerV2 from "../../abi/tokenMessagerAbi.json";
import { useWalletClient } from "wagmi";
import { getAddress, pad, parseUnits } from "viem";

export function useDepositForBurn(contractAddress) {
  const { data: walletClient } = useWalletClient();
  const [status, setStatus] = useState("idle");
  const [txHash, setTxHash] = useState(null);

  async function depositForBurn({ amount, destinationDomain, mintRecipient, burnToken, maxFee, minFinalityThreshold  }) {
    try {
      setStatus("pending");
     // const recipientBytes32 = addressToBytes32(mintRecipient);
     
        const originalAddress = mintRecipient;
        const cleanAddress = originalAddress.slice(2);
        const mintRecipientBytes32 = `0x${cleanAddress.padStart(64, '0')}`;
        const burn = getAddress(burnToken)
        const hash = await walletClient.writeContract({
            address: contractAddress,
            abi: TokenMessengerV2.abi,
            functionName: "depositForBurn",
            args: [
            parseUnits(amount.toString(), 6),
            destinationDomain,
            mintRecipientBytes32,
            burn,
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            maxFee,
            minFinalityThreshold
            ],
        });
        console.log("burnHash:", hash)
      setTxHash(hash);
      setStatus("success");
      return hash
    } catch (err) {
      console.error("depositForBurn error:", err);
      setStatus("error");
    }
  }

  return { depositForBurn, status, txHash };
}
