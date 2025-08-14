import { encodePacked, parseUnits } from "viem";
import { signPermit } from "./permit.js";
import { paymasterAddresses } from "./data.js";

//const paymasterAddress = process.env.PAYMASTER_V07_ADDRESS;

export const paymaster = {
  async getPaymasterData({usdcAddress, account, client, amount, chain}) {
    const permitAmount = parseUnits(amount.toString(), 6);
    const permitSignature = await signPermit({
      tokenAddress: usdcAddress,
      account,
      client,
      spenderAddress: paymasterAddresses[chain],
      permitAmount: permitAmount,
    });

    const paymasterData = encodePacked(
      ["uint8", "address", "uint256", "bytes"],
      [0, usdcAddress, permitAmount, permitSignature],
    );

    return {
      paymaster: paymasterAddresses[chain],
      paymasterData,
      paymasterVerificationGasLimit: 200000n,
      paymasterPostOpGasLimit: 15000n,
      isFinal: true,
    };
  },
};
