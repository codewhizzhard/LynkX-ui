import { useWalletClient } from "wagmi";
import { useState } from "react";
import { getAddress } from "viem";
import MessageTransmitterAbi from "../../abi/messageTransmitterV2.json";

export function useMintUSDC() {
  const { data: walletClient } = useWalletClient();
  const [status, setStatus] = useState("idle");
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState(null);

  async function mintUSDC({ transmitterAddress, attestation }) {
    console.log("gtAddress:", transmitterAddress, attestation)
    try {
      setStatus("pending");
      setError(null);

      const hash = await walletClient.writeContract({
        address: "0xa9fB1b3009DCb79E2fe346c16a604B8Fa8aE0a79" /* getAddress(transmitterAddress) */,
        abi: MessageTransmitterAbi.abi,/* [
        {
          type: "function",
          name: "receiveMessage",
          stateMutability: "nonpayable",
          inputs: [
            { name: "message", type: "bytes" },
            { name: "attestation", type: "bytes" },
          ],
          outputs: [],
        },
      ], */
        //abi: MessageTransmitterAbi.abi, 
        functionName: "receiveMessage",
        args: [
          attestation.message,
          attestation.attestation,
        ],
      });

      setTxHash(hash);
      setStatus("success");
      return hash
    } catch (err) {
      console.error("mintUSDC error:", err);
      setError(err);
      setStatus("error");
    }
  }

  return { mintUSDC, status, txHash, error };
}
